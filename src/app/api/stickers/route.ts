import { NextResponse } from "next/server";
import dbConnect, { Sticker } from "../../../../lib/dbConnect";

export async function GET() {
  await dbConnect();
  try {
    let stickerDoc = await Sticker.findOne({});

    if (!stickerDoc) {
      stickerDoc = await Sticker.create({ count: 0 });
    }

    return NextResponse.json({ count: stickerDoc.count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST() {
  await dbConnect();
  try {
    let stickerDoc = await Sticker.findOne({});

    if (!stickerDoc) {
      stickerDoc = await Sticker.create({ count: 0 });
    }

    if (stickerDoc.count < 10) {
      stickerDoc.count += 1;
      await stickerDoc.save();
    }

    return NextResponse.json({ count: stickerDoc.count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await dbConnect();
  try {
    let stickerDoc = await Sticker.findOne({});

    if (!stickerDoc) {
      stickerDoc = await Sticker.create({ count: 0 });
    }

    stickerDoc.count = 0;
    await stickerDoc.save();

    return NextResponse.json({ count: stickerDoc.count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
