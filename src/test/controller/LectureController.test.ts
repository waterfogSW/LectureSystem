import 'reflect-metadata';
import { LectureController } from '../../main/controller/LectureController';
import { LectureFacade } from '../../main/facade/LectureFacade';
import { MockFactory } from '../util/MockFactory';
import { Request, Response } from 'express';
import { HttpStatus } from '../../main/common/constant/HttpStatus';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IllegalArgumentException } from '../../main/common/exception/IllegalArgumentException';
import { TestLectureDataFactory } from '../util/TestLectureDataFactory';
import { MockRequestFactory } from '../util/MockRequestFactory';
import { MockResponseFactory } from '../util/MockResponseFactory';
import { LectureCreateResponse } from '../../main/controller/dto/LectureCreateResponse';
import { LectureCategory, LectureOrderType, LectureSearchType } from '../../main/domain/LectureEnums';

describe('LectureController', () => {

  let mockLectureService: jest.Mocked<LectureFacade>;
  let sut: LectureController;

  beforeEach(() => {
    mockLectureService = MockFactory.create<LectureFacade>();
    sut = new LectureController(mockLectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLecture', () => {

    it('[Success] 새로운 강의를 생성한다.', async () => {
      // given
      const data = TestLectureDataFactory.createData();
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(data), MockResponseFactory.create()];

      const response: LectureCreateResponse = new LectureCreateResponse(1, data.title);
      mockLectureService.createLecture.mockResolvedValue(response);

      // when
      await sut.createLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toBeCalledWith(response);
    });

    it('[Failure] 유효하지 않은 카테고리가 들어오면 예외를 던진다', async () => {
      // given
      const testInvalidCategory: LectureCategory = 'INVALID_CATEGORY' as LectureCategory;
      const data = TestLectureDataFactory.createData({ category: testInvalidCategory });
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.createLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('listLecture', () => {

    it('[Success] 강의 목록을 조회한다(page, pageSize)', async () => {
      // given
      const data: any = { page: 1, pageSize: 20 };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when
      await sut.listLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 페이지가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { page: -1, pageSize: 20 };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.listLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] 페이지 사이즈가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: -1 };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.listLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureOrderType))
    (`[Success] 강의 목록을 조회한다(page, pageSize, order = %s)`, async (orderType: LectureOrderType) => {
      // given
      const data: any = { page: 1, pageSize: 20, order: orderType };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when
      await sut.listLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 정렬 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, order: 'INVALID_ORDER_TYPE' };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.listLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureCategory))
    (`[Success] 강의 목록을 조회한다(page, pageSize, category = %s)`, async (category: LectureCategory) => {
      // given
      const data: any = { page: 1, pageSize: 20, category: category };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when
      await sut.listLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 카테고리 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, category: 'INVALID_CATEGORY' };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.listLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

    it.each(Object.values(LectureSearchType))
    (`[Success] 강의 목록을 조회한다(page, pageSize, searchType = %s, searchKeyword)`, async (searchType: LectureSearchType) => {
      // given
      const data: any = { page: 1, pageSize: 20, searchType: searchType, searchKeyword: 'searchKeyword' };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when
      await sut.listLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] 유효하지 않은 검색 타입이 들어오면 예외를 던진다', async () => {
      // given
      const data: any = { page: 1, pageSize: 20, searchType: 'INVALID_SEARCH_TYPE', searchKeyword: 'searchKeyword' };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithQuery(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.listLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });
  });

  describe('createMultipleLectures', () => {
      it.each([1,10])(`[Success] 강의를 %i개 생성한다`, async (count: number) => {
        // given
        const data: Array<any> = TestLectureDataFactory.createMultipleData(count);
        const items = { items : data };
        const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(items), MockResponseFactory.create()];

        // when
        await sut.createMultipleLectures(mockRequest, mockResponse);

        // then
        expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
      });

      it('[Failure] 최대 10개까지 요청 가능하다', async () => {
        // given
        const data: Array<any> = TestLectureDataFactory.createMultipleData(11);
        const items = { items : data };
        const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(items), MockResponseFactory.create()];

        // when, then
        await expect(sut.createMultipleLectures(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
      });

      it('[Failure] 최소 1개 이상 요청 가능하다', async () => {
        // given
        const data: Array<any> = TestLectureDataFactory.createMultipleData(0);
        const items = { items : data };
        const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(items), MockResponseFactory.create()];

        // when, then
        await expect(sut.createMultipleLectures(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
      });

      it('[Failure] 배열 형식이 아니면 예외를 던진다', async () => {
        // given
        const data: any = { items : 'notArray' };
        const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithBody(data), MockResponseFactory.create()];

        // when, then
        await expect(sut.createMultipleLectures(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
      });
  });

  describe('detailLecture', () => {
    it('[Success] 강의 상세 정보를 조회한다', async () => {
      // given
      const data: any = { id: 1 };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithParams(data), MockResponseFactory.create()];

      // when
      await sut.detailLecture(mockRequest, mockResponse);

      // then
      expect(mockResponse.status).toBeCalledWith(HttpStatus.OK);
    });

    it('[Failure] id가 숫자가 아니면 예외를 던진다', async () => {
      // given
      const data: any = { id: 'notNumber' };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithParams(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.detailLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

    it('[Failure] id가 0보다 작으면 예외를 던진다', async () => {
      // given
      const data: any = { id: -1 };
      const [mockRequest, mockResponse]: [Request, Response] = [MockRequestFactory.createWithParams(data), MockResponseFactory.create()];

      // when, then
      await expect(sut.detailLecture(mockRequest, mockResponse)).rejects.toThrowError(IllegalArgumentException);
    });

  });
});
