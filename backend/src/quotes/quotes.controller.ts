import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Quote } from './quote.interface';

@Controller('api/quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll(): Quote[] {
    return this.quotesService.findAll();
  }

  @Post()
  create(@Body() quote: Omit<Quote, 'id'>): Quote {
    return this.quotesService.create(quote);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.quotesService.delete(id);
    return { success };
  }
}
