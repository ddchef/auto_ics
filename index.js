const axios = require('axios')
const {v4} = require('uuid')
const Ics = require('./ics')
const dayjs = require('dayjs')
const fs = require('fs')

const ics = new Ics()

ics.create()

const today = dayjs().format('YYYYMMDDTHHmmssZ[Z]')
const nowYear = dayjs().year()
const nextYear = dayjs().add(1,'year').year()

const reqs = [nowYear,nextYear].map(year=>axios.get(`https://api.apihubs.cn/holiday/get?field=holiday_overtime,holiday_legal,holiday_recess,holiday,date&year=${year}&cn=1&size=365`))

Promise.all(reqs).then(
    ([now,next])=>{
        const nowDay = now.data.data.list
        const nextDays = next.data.data.list
        const days = [...nowDay,...nextDays]
        days.forEach(day=>{
            const id = v4()
            if(day.holiday_overtime!==10){
                ics.addVevent({
                    DTSTAMP:today,
                    UID:id,
                    "DTSTART;VALUE=DATE":day.date,
                    "CLASS":"PUBLIC",
                    "SUMMARY;LANGUAGE=zh_CN":day.holiday_overtime_cn,
                    "TRANSP":"TRANSPARENT",
                    "CATEGORIES":"调休",
                    "X-APPLE-UNIVERSAL-ID":id
                })
            }
            if(day.holiday_recess===1){
                ics.addVevent({
                    DTSTAMP:today,
                    UID:id,
                    "DTSTART;VALUE=DATE":day.date,
                    "CLASS":"PUBLIC",
                    "SUMMARY;LANGUAGE=zh_CN":day.holiday_cn,
                    "TRANSP":"TRANSPARENT",
                    "CATEGORIES":"放假",
                    "X-APPLE-UNIVERSAL-ID":id
                })
            }
        })
        const test = ics.getData()
        fs.writeFile('./demo.ics',test,(error)=>{

        })
        console.log(test)
    }
)
