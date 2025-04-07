// // import { Controller } from '@nestjs/common';

// // @Controller('tests')
// // export class TestsController {}

// import { Controller, Post, Body, UseGuards, Request, Get, ParseIntPipe, Param, Delete } from '@nestjs/common';
// import { TestsService } from './tests.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CreateTestDto } from './dto/create-test.dto';

// @Controller('tests')
// @UseGuards(JwtAuthGuard)
// export class TestsController {
//   constructor(private readonly testsService: TestsService) {}

//   @Post('create-with-questions')
//   async createTestWithQuestions(
//     @Request() req,
//     @Body() createTestDto: CreateTestDto,
//   ) {
//     // req.user contains the authenticated admin's details (populated by JwtStrategy)
//     return this.testsService.createTestWithQuestions(
//       req.user.id,
//       createTestDto,
//     );
//   }

//   // We can add endpoints to list tests, view test results, etc.

//   @Get()
//   async getTests(@Request() req) {
//     return this.testsService.getTests(req.user.id);
//   }
//   //

//   //

//   @Get('all')
//   async getAllTests() {
//     return this.testsService.getAllTests();
//   }

//   //

//    // Updated endpoint to check if the test belongs to the authenticated admin
//    @Get(':id/results')
//    async getTestResults(@Request() req, @Param('id', ParseIntPipe) id: number) {
//      return this.testsService.getTestResults(req.user.id, id);
//    }

//    // New endpoint to delete a test
//   @Delete(':id')
//   async deleteTest(@Request() req, @Param('id', ParseIntPipe) id: number) {
//     return this.testsService.deleteTest(req.user.id, id);
//   }

// }

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTestDto } from './dto/create-test.dto';
import { SubmitTestResultDto } from './dto/submit-test-result.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('create-with-questions')
  @UseGuards(JwtAuthGuard)
  async createTestWithQuestions(
    @Request() req,
    @Body() createTestDto: CreateTestDto,
  ) {
    return this.testsService.createTestWithQuestions(
      req.user.id,
      createTestDto,
    );
  }

  // Only accessible by the admin who created the test.
  @Get()
  @UseGuards(JwtAuthGuard)
  async getTests(@Request() req) {
    return this.testsService.getTests(req.user.id);
  }

  // Public route: no guard applied.
  @Get('all')
  async getAllTests() {
    return this.testsService.getAllTests();
  }

  @Get(':id/results')
  @UseGuards(JwtAuthGuard)
  async getTestResults(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.testsService.getTestResults(req.user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTest(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.testsService.deleteTest(req.user.id, id);
  }

  @Post(':id/submit-result')
  async submitTestResult(
    @Param('id', ParseIntPipe) testId: number,
    @Body() submitTestResultDto: SubmitTestResultDto,
  ) {
    return this.testsService.submitTestResult(testId, submitTestResultDto);
  }

  //
 

 


  //

}
