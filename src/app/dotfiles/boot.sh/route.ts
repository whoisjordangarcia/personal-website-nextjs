import { NextResponse } from "next/server";

const BOOT_SCRIPT_URL = "https://raw.githubusercontent.com/whoisjordangarcia/dotfiles/main/boot.sh";

export async function GET() {
  try {
    const response = await fetch(BOOT_SCRIPT_URL);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch boot script" },
        { status: 500 }
      );
    }

    const scriptContent = await response.text();

    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching boot script:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}