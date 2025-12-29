import { Injectable } from '@nestjs/common';
import { Meme } from './meme.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MemesService {
  private readonly dataPath = path.join(
    process.env.DATA_DIR || path.join(__dirname, '../../data'),
    'memes.json'
  );
  private readonly uploadsDir = path.join(
    process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads'),
    'memes'
  );

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private readData(): Meme[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(memes: Meme[]) {
    fs.writeFileSync(this.dataPath, JSON.stringify(memes, null, 2));
  }

  findAll(): Meme[] {
    return this.readData();
  }

  create(memeData: Omit<Meme, 'id' | 'upvotes' | 'downvotes' | 'score'>): Meme {
    const memes = this.readData();
    const newMeme: Meme = {
      ...memeData,
      id: Date.now().toString(),
      upvotes: 0,
      downvotes: 0,
      score: 0,
    };
    memes.push(newMeme);
    this.writeData(memes);
    return newMeme;
  }

  delete(id: string): boolean {
    const memes = this.readData();
    const meme = memes.find((m) => m.id === id);

    if (!meme) return false;

    const filePath = path.join(this.uploadsDir, meme.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const filtered = memes.filter((m) => m.id !== id);
    this.writeData(filtered);
    return true;
  }

  vote(id: string, voteType: 'up' | 'down'): Meme | null {
    const memes = this.readData();
    const meme = memes.find((m) => m.id === id);

    if (!meme) return null;

    if (voteType === 'up') {
      meme.upvotes++;
    } else {
      meme.downvotes++;
    }

    meme.score = meme.upvotes - meme.downvotes;
    this.writeData(memes);
    return meme;
  }

  getHallOfFame(limit: number = 10): Meme[] {
    const memes = this.readData();
    return memes
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
