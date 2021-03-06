import knex from 'knex'
import dotenv from 'dotenv'
import { sha3_512 } from 'js-sha3'
dotenv.config()

const DBConfig = {
    host:'wnsghtjqj.kro.kr', // 아이피 (IP)
    port: 3306, // 포트 3306 (포트 3306 열어줘야함)
    user: 'junho', // user의 이름 (username)
    database : '' // database 이름 (Data Base Name)
}

const db = knex({
    client: 'mysql',
    connection: DBConfig
})

export default async function AuthAPI (req, res) {
    const { username, Password, checkPassword } = JSON.parse(req.body)
    let salt = ""
    for(let i = 1; i <= 10; i++){
        salt += String.fromCharCode(Math.random() * (6064 - 6016) + 6016)
    }
    const password = ""+sha3_512(salt+Password)
    const [user] = await db.select('*').from('users').where('username', username)
    if (!user && Password == checkPassword){
        await db.insert({ username, password, salt }).into('users')
        return res.send({ success: true })
    }
    return res.send({ success: false, msg: "아이디가 일치 하는 사람이 있거나 비밀번호가 일치 하지 않습니다."})
}
