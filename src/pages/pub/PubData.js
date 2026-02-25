// src/data.js
export const PUB_DATA = [
    {
        category: '카테고리1',
        categoryID: 'guiSection1',
        lists: [
            {
                Depth1: '페이지1',
                Depth2: '서브1',
                Depth3: '세부1',
                title: '퍼블리싱 작업 내용 1',
                filename: 'file1',
                worker: '홍길동',
                date: '24.01.01',
                modi: [
                    {date: '24.01.02', desc: '수정 내용 1'},
                    {date: '24.01.03', desc: '수정 내용 2'},
                ],
                status: 'modi',
                etc: '비고 내용 1'
            },
            {
                Depth1: '페이지2',
                Depth2: '서브2',
                Depth3: '세부2',
                title: '퍼블리싱 작업 내용 2',
                filename: 'file2',
                worker: '김철수',
                date: '24.01.05',
                modi: [],
                status: 'done',
                etc: '비고 내용 2'
            }
        ]
    },
    {
        category: '카테고리2',
        categoryID: 'guiSection2',
        lists: [
            {
                Depth1: '페이지3',
                Depth2: '서브3',
                Depth3: '세부3',
                title: '퍼블리싱 작업 내용 3',
                filename: 'file3',
                worker: '이영희',
                date: '24.01.10',
                modi: [
                    {date: '24.01.11', desc: '수정 내용 3'}
                ],
                status: 'ing',
                etc: '비고 내용 3'
            }
        ]
    }
];