function ics(){}
ics.prototype.startWiht = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:icalendar-ruby
CALSCALE:GREGORIAN
X-WR-CALNAME:中国节假日
X-APPLE-LANGUAGE:zh
X-APPLE-REGION:CN\n`

ics.prototype.endWith = `\nEND:VCALENDAR`

ics.prototype.data=''

ics.prototype.addVevent = function (event){
    let _e_ = 'BEGIN:VEVENT\n'
    const keys = Object.keys(event)
    keys.forEach(key=>{
        _e_+=`${key}:${event[key]}\n`
    })
    _e_+='END:VEVENT\n'
    this.data += _e_
}

ics.prototype.create = function(){
    this.data = this.startWiht
}

ics.prototype.getData = function(){
    this.data += this.endWith
    return this.data
}

module.exports = ics