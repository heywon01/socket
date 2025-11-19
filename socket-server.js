// [socket_server.js] - 전용 서버에 배포하여 웹소켓 연결만 담당

require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); 

// Socket.IO 서버 설정 (클라이언트 연결 주소 허용)
const io = require("socket.io")(server, {
  cors: {
    origin: "https://211-olive.vercel.app", 
    methods: ["GET", "POST"]
  }
});


const SOCKET_PORT = process.env.SOCKET_PORT || 4000;

// Socket.IO Connection (실시간 알림 로직)
io.on('connection', (socket) => {
    console.log('✅ Socket.IO: 새로운 사용자 연결됨 (' + socket.id + ')');
    
    // **API 서버(Vercel)로부터 알림을 받아 클라이언트들에게 전달하는 리스너**
    // 퀴즈 제출 결과
    socket.on('api_problem_solved', (data) => {
        io.emit('problem_solved', data); // 모든 클라이언트에게 전달
    });
    
    // 새 문제 추가 알림
    socket.on('api_new_problem', (data) => {
        io.emit('new_problem', data); // 모든 클라이언트에게 전달
    });
    
    // 문제 삭제 알림
    socket.on('api_problem_deleted', (problemId) => {
        io.emit('problem_deleted', problemId); // 모든 클라이언트에게 전달
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Socket.IO: 사용자 연결 해제됨 (' + socket.id + ')');
    });
});

// 웹소켓 서버 리스닝
server.listen(SOCKET_PORT, () => {
    console.log(`🚀 WebSoket Server running on port ${SOCKET_PORT}`);
});
