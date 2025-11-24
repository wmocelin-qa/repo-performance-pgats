import http from 'k6/http';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ['p(90)<=15', 'p(95)<=20'],
    http_req_failed: ['rate<0.01']
  }
};

export default function() {
  let responseInstructorLogin = http.post(
    'http://localhost:3000/instructors/login', 
    JSON.stringify({
        email: "wesley@prof.com",
        password: "1234"
  }), 
  {
    headers: {
        'Content-Type': 'application/json'
    }
  });

  //console.log(res.json('token'))
  sleep(1); // User Think Time

  let responseLogin = http.post(
    'http://localhost:3000/lessons', 
    JSON.stringify({
        title: "Teste criar lição",
        description: "Teste perfomance"
  }), 
  {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${responseInstructorLogin.json('token')}`
    }
  });

  check(responseLogin, {
    'status deve ser igual a 201': (r) => r.status === 201
  })
  
  sleep(1); // User Think Time

  let responseStudentLogin = http.post(
    'http://localhost:3000/students/login', 
    JSON.stringify({
        email: "wesley@aluno.com",
        password: "1234"
  }), 
  {
    headers: {
        'Content-Type': 'application/json'
    }
  });
  
  console.log(`Token aluno`, responseStudentLogin.json('token'))
  sleep(1); // User Think Time
    
}