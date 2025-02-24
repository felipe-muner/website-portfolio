import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// POST: Create a new session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teacher, classname, startDatetime, endDatetime } = body;

    if (!teacher || !classname || !startDatetime || !endDatetime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await prisma.classSession.create({
      data: {
        teacher,
        classname,
        startDatetime: new Date(startDatetime),
        endDatetime: new Date(endDatetime)
      }
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    await prisma.classSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete session" },
      { status: 500 }
    );
  }
}