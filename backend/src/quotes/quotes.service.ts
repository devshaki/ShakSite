import { Injectable } from '@nestjs/common';
import { Quote } from './quote.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuotesService {
  private readonly dataPath = path.join(
    process.env.DATA_DIR || path.join(__dirname, '../../data'),
    'quotes.json'
  );

  constructor() {
    this.ensureDataFile();
  }

  private ensureDataFile() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
  }

  private readData(): Quote[] {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(quotes: Quote[]) {
    fs.writeFileSync(this.dataPath, JSON.stringify(quotes, null, 2));
  }

  findAll(): Quote[] {
    return this.readData();
  }

  create(quote: Omit<Quote, 'id'>): Quote {
    const quotes = this.readData();
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
    };
    quotes.push(newQuote);
    this.writeData(quotes);
    return newQuote;
  }

  delete(id: string): boolean {
    const quotes = this.readData();
    const filtered = quotes.filter((q) => q.id !== id);
    if (filtered.length === quotes.length) {
      return false;
    }
    this.writeData(filtered);
    return true;
  }
}
