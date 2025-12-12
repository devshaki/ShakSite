import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamDate } from './exam.interface';

@Controller('api/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findAll(): ExamDate[] {
    return this.examsService.findAll();
  }

  @Post()
  create(@Body() exam: Omit<ExamDate, 'id'>): ExamDate {
    return this.examsService.create(exam);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() exam: Partial<ExamDate>): ExamDate | null {
    return this.examsService.update(id, exam);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.examsService.delete(id);
    return { success };
  }
}
