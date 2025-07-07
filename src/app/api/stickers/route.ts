import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// GET: 현재 스티커 개수를 가져옵니다.
export async function GET() {
  try {
    // praise_stickers 테이블이 없으면 생성합니다.
    await sql`
      CREATE TABLE IF NOT EXISTS praise_stickers (
        id SERIAL PRIMARY KEY,
        count INT NOT NULL DEFAULT 0
      );
    `;

    // 데이터가 있는지 확인하고, 없으면 기본값(0)으로 삽입합니다.
    const hasData = await sql`SELECT id FROM praise_stickers LIMIT 1;`;
    if (hasData.rowCount === 0) {
      await sql`INSERT INTO praise_stickers (count) VALUES (0);`;
    }

    // 현재 스티커 개수를 가져옵니다.
    const result = await sql`SELECT count FROM praise_stickers;`;
    const count = result.rows[0].count;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: 스티커 개수를 1 증가시킵니다.
export async function POST() {
  try {
    // 현재 개수가 10 미만일 때만 1을 더합니다.
    await sql`
      UPDATE praise_stickers
      SET count = count + 1
      WHERE id = 1 AND count < 10;
    `;

    const result = await sql`SELECT count FROM praise_stickers;`;
    const count = result.rows[0].count;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: 스티커 개수를 0으로 초기화합니다.
export async function DELETE() {
  try {
    await sql`UPDATE praise_stickers SET count = 0 WHERE id = 1;`;

    return NextResponse.json({ count: 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
