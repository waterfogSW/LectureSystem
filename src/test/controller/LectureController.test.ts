import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureFacade } from '../../main/facade/LectureFacade';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HttpStatus } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { MockResponseFactory } from '../util/MockResponseFactory';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';
import { LectureCategory, LectureOrderType, LectureSearchType } from '../../main/domain/LectureEnums';
import { MockRequestBuilder } from '../util/MockRequestBuilder';

describe('LectureController', () => {

  let mockLectureFacade: jest.Mocked<LectureFacade>;
  let sut: LectureController;

  beforeEach(() => {
    mockLectureFacade = MockFactory.create<LectureFacade>();
    sut = new LectureController(mockLectureFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecture', () => {

    it('[Success] 새로운 강의생성 요청을 받는다', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      const responseData: LectureCreateResponse = new LectureCreateResponse(1, data.title);
      mockLectureFacade.createLecture.mockResolvedValue(responseData);

      // when
      await sut.createLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.CREATED);
      expect(response.json).toBeCalledWith(responseData);
    });

    it('[Failure] 유효하지 않은 카테고리가 들어오면 예외를 던진다', async () => {
      // given
      const testInvalidCategory: LectureCategory = 'INVALID_CATEGORY' as LectureCategory;
      const data = TestLectureDataFactory.createData({ category: testInvalidCategory });
      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('listLecture', () => {

    it('[Success] 강의 목록을 조회한다(page, pageSize)', async () => {
      // given
      const data: any = { page: 1, pageSize: 20 };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.listLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 페이지가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { page: -1, pageSize: 20 };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.listLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] 페이지 사이즈가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: -1 };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.listLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureOrderType))
    (`[Success] 강의 목록조회를 요청한다(page, pageSize, order = %s)`, async (orderType: LectureOrderType) => {
      // given
      const data: any = { page: 1, pageSize: 20, order: orderType };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.listLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 정렬 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, order: 'INVALID_ORDER_TYPE' };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.listLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureCategory))
    (`[Success] 강의 목록을 조회를 요청한다.(page, pageSize, category = %s)`, async (category: LectureCategory) => {
      // given
      const data: any = { page: 1, pageSize: 20, category: category };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.listLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 카테고리 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, category: 'INVALID_CATEGORY' };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.listLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureSearchType))
    (`[Success] 강의 목록조회를 요청한다(page, pageSize, searchType = %s, searchKeyword)`, async (searchType: LectureSearchType) => {
      // given
      const data: any = { page: 1, pageSize: 20, searchType: searchType, searchKeyword: 'searchKeyword' };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.listLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 검색 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, searchType: 'INVALID_SEARCH_TYPE', searchKeyword: 'searchKeyword' };
      const request: Request = new MockRequestBuilder().query(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.listLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('createMultipleLectures', () => {
    it.each([1, 10])(`[Success] 강의를 %i개 생성한다`, async (count: number) => {
      // given
      const data: Array<any> = TestLectureDataFactory.createMultipleData(count);
      const items = { items: data };
      const request: Request = new MockRequestBuilder().body(items).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.createMultipleLectures(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 10개 이상 요청하면 예외를 던진다', async () => {
      // given
      const data: Array<any> = TestLectureDataFactory.createMultipleData(11);
      const items = { items: data };
      const request: Request = new MockRequestBuilder().body(items).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createMultipleLectures(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] 0개를 요청하면 예외를 던진다', async () => {
      // given
      const data: Array<any> = TestLectureDataFactory.createMultipleData(0);
      const items = { items: data };
      const request: Request = new MockRequestBuilder().body(items).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createMultipleLectures(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] 배열 형식이 아니면 예외를 던진다', async () => {
      // given
      const data: any = { items: 'notArray' };
      const request: Request = new MockRequestBuilder().body(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.createMultipleLectures(request, response)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('detailLecture', () => {
    it('[Success] 강의 상세 정보를 조회를 요청한다.', async () => {
      // given
      const data: any = { id: 1 };
      const request: Request = new MockRequestBuilder().params(data).build();
      const response: Response = MockResponseFactory.create();

      // when
      await sut.detailLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] id가 숫자가 아니면 예외를 던진다', async () => {
      // given
      const data: any = { id: 'notNumber' };
      const request: Request = new MockRequestBuilder().params(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.detailLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] id가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { id: -1 };
      const request: Request = new MockRequestBuilder().params(data).build();
      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.detailLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

  });

  describe('updateLecture', () => {
    it('[Success] 강의 정보수정을 요청한다', async () => {
      // given
      const request: Request = new MockRequestBuilder()
        .params({ id: 1 })
        .body({ title: 'newTitle', introduction: 'newIntroduction', price: 10000 })
        .build();

      const response: Response = MockResponseFactory.create();

      // when
      await sut.updateLecture(request, response);

      // then
      expect(response.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] id가 숫자가 아니면 예외를 던진다', async () => {
      // given
      const request: Request = new MockRequestBuilder()
        .params({ id: 'notNumber' })
        .body({ title: 'newTitle', introduction: 'newIntroduction', price: 10000 })
        .build();

      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.updateLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] id가 0보다 작으면 예외를 던진다', async () => {
      // given
      const request: Request = new MockRequestBuilder()
        .params({ id: -1 })
        .body({ title: 'newTitle', introduction: 'newIntroduction', price: 10000 })
        .build();

      const response: Response = MockResponseFactory.create();

      // when, then
      await expect(sut.updateLecture(request, response)).rejects.toThrowError(IllegalArgumentException);
    });
  });
});
