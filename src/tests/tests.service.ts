// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TestsService {}
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { SubmitTestResultDto } from './dto/submit-test-result.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // async createTestWithQuestions(adminId: number, data: CreateTestDto) {
  //   return this.prisma.test.create({
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       duration: data.duration,
  //       isLive: data.isLive,
  //       admin: { connect: { id: adminId } },
  //       questions: {
  //         create: data.questions.map((q) => ({
  //           questionText: q.questionText,
  //           imageUrl: q.imageUrl,
  //           options: {
  //             create: q.options.map((o) => ({
  //               text: o.text,
  //               isCorrect: o.isCorrect ?? false,
  //             })),
  //           },
  //         })),
  //       },
  //     },
  //     include: {
  //       questions: {
  //         include: {
  //           options: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async createTestWithQuestions(adminId: number, data: CreateTestDto) {
    await this.prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        isLive: data.isLive,
        admin: { connect: { id: adminId } },
        questions: {
          create: data.questions.map((q) => ({
            questionText: q.questionText,
            imageUrl: q.imageUrl,
            options: {
              create: q.options.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect ?? false,
              })),
            },
          })),
        },
      },
    });
    return { message: 'Test created successfully' };
  }

  // We can add more methods to get tests or test results as needed.

  async getTests(adminId: number) {
    return this.prisma.test.findMany({
      where: { adminId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  //

  //
  async getAllTests() {
    return this.prisma.test.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }


  //

  // test result

  async getTestResults(adminId: number, testId: number) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { results: true },
    });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.adminId !== adminId) {
      throw new UnauthorizedException('You are not authorized to view the results of this test');
    }
    return test.results;
  }

  //

  // delete tests

  async deleteTest(adminId: number, testId: number) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
    });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.adminId !== adminId) {
      throw new UnauthorizedException('You are not authorized to delete this test');
    }
    await this.prisma.test.delete({
      where: { id: testId },
    });
    return { message: 'Test deleted successfully' };
  }


  //

  // Submit tests
  async submitTestResult(testId: number, data: SubmitTestResultDto) {
    // 1) Check if the test exists
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
  
    // 2) Create a test result record with the user details
    const testResult = await this.prisma.testResult.create({
      data: {
        testId,
        score: data.score,
        userName: data.userName,
        userPhone: data.userPhone,
        userEmail: data.userEmail,
      },
    });
  
    return { message: 'Test result submitted successfully' };
  }

  

}
