import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const targetUrl = url.searchParams.get("url");

	if (!targetUrl) {
		return json({ error: "URL parameter is required" }, { status: 400 });
	}

	try {
		console.log(`프록시 요청: ${targetUrl}`);

		// 외부 웹사이트에 요청 보내기
		const response = await fetch(targetUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "ko,en-US;q=0.9,en;q=0.8",
				// 압축 콘텐츠 요청 안함 - 디코딩 오류 방지
				"Accept-Encoding": "identity",
			},
		});

		// 응답 헤더 설정
		const headers = new Headers();

		// 원본 응답의 모든 헤더를 복사 (문제가 되는 보안 헤더 제외)
		response.headers.forEach((value, key) => {
			// 다음 헤더들은 제외 (iframe 로딩 문제를 일으키는 헤더들)
			const lowerKey = key.toLowerCase();
			if (lowerKey !== "x-frame-options" && lowerKey !== "content-security-policy" && lowerKey !== "frame-options" && lowerKey !== "content-encoding") {
				headers.set(key, value);
			}
		});

		// 원본 Content-Type 유지
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "text/html; charset=utf-8");
		}

		// CORS 헤더 설정
		const origin = request.headers.get("Origin") || "https://localhost:5174";
		headers.set("Access-Control-Allow-Origin", origin);
		headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		headers.set("Access-Control-Allow-Headers", "Content-Type");
		headers.set("Access-Control-Allow-Credentials", "true");

		// 응답 본문 가져오기
		let text = await response.text();

		// HTML 콘텐츠인 경우 추가 처리
		const contentType = headers.get("Content-Type");
		if (contentType && contentType.includes("text/html")) {
			// base 태그 추가
			if (text.includes("<head>")) {
				text = text.replace("<head>", `<head><base href="${targetUrl}">`);
			} else if (text.includes("<html>")) {
				text = text.replace("<html>", `<html><head><base href="${targetUrl}"></head>`);
			}

			// HTML 내의 보안 관련 메타 태그 제거
			text = text.replace(/<meta\s+http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");
			text = text.replace(/<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
			text = text.replace(/<meta\s+http-equiv=["']Frame-Options["'][^>]*>/gi, "");
		}

		console.log(`프록시 응답: ${response.status} ${response.statusText}`);

		return new Response(text, {
			status: response.status,
			headers,
		});
	} catch (error) {
		console.error("프록시 오류:", error);
		return json(
			{
				error: "Failed to fetch the requested URL",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
