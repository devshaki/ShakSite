import { Injectable } from '@nestjs/common';
import { Meme } from './meme.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MemesService {
  private readonly dataPath = path.join(__dirname, '../../data/memes.json');
  private readonly uploadsDir = path.join(__dirname, '../../uploads/memes');

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

  create(memeData: Omit<Meme, 'id'>): Meme {
    const memes = this.readData();
    const newMeme: Meme = {
      ...memeData,
      id: Date.now().toString(),
    };
    memes.push(newMeme);
    this.writeData(memes);
    return newMeme;
  }

  delete(id: string): boolean {
    const memes = this.readData();
    const meme = memes.find((m) => m.id === id);

    if (!meme) return false;

    // Delete the file
    const filePath = path.join(this.uploadsDir, meme.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from data
    const filtered = memes.filter((m) => m.id !== id);
    this.writeData(filtered);
    return true;
  }
}
