class cbusMessage {
    constructor(msg) {
        this.message = msg.toString();
        /*        this.header = parseInt(this.message.substr(0,7),16)
                this.prority1 = this.header >>>14
                this.prority2 = this.header >>>12 & 3;
                this.canId = header >>>5 & 31
                this.type = this.message.substr(6,1)*/
    }

   /* header() {
        const header = parseInt(this.message.substr(2, 4), 16)
        const priority1 = header >>> 14
        const priority2 = header >>> 12 & 3;
        const canId = header >>> 5 & 31
        const type = this.message.substr(6, 1)
        const outHeader = ((((priority1 * 4) + priority2) * 128) + canId) << 5
        //return `Pr1:${priority1} Pr2:${priority2} CanId:${canId} Type:${type} Header:${header} outHeader:${outHeader}`
        return `:S${outHeader.toString(16).toUpperCase()}N`
    }
*/
    deCodeCbusMsg() {
        const event = this.message;
        const header = parseInt(event.substr(2, 4), 16);
        const pr1 = header >>> 14;
        const pr2 = header >>> 12 & 3;
        const canNodeId = header >>> 5 & 31;
        const type = event.substr(6, 1);
        const opCode = event.substr(7, 2);
        const nodeId = parseInt(event.substr(9, 4), 16);
        const eventId = event.substr(13, 4);
        return ` PR1:${pr1} PR2:${pr2} CanId:${canNodeId} type:${type} opCode:${opCode} Cbus NodeId:${nodeId} Event Id:${eventId}`;
    }

    opCode() {
        return this.message.substr(7, 2);
    }

    nodeId() {
        return parseInt(this.message.substr(9, 4), 16);
    }

    sessionId() {
        return parseInt(this.message.substr(9, 2), 16);
    }

    locoId() {
        return parseInt(this.message.substr(11, 4), 16);
    }

    locoSpeed() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    locoF1() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    locoF2() {
        return parseInt(this.message.substr(19, 2), 16);
    }

    locoF3() {
        return parseInt(this.message.substr(21, 2), 16);
    }

    eventId() {
        return parseInt(this.message.substr(13, 4), 16);
    }

    fullEventId() {
        return this.message.substr(9, 8);
    }

    shortEventId() {
        return '0000'+this.message.substr(13, 4);
    }

    manufId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    moduleId() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    flags() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    paramId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    errorId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    actionId() {
        return this.message.substr(13, 8);
    }

    actionEventId() {
        return parseInt(this.message.substr(21, 2), 16);
    }

    actionEventIndex() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    actionEventVarId() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    actionEventVarVal() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    variableId() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    variableVal() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    paramValue() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    eventNo() {
        return parseInt(this.message.substr(17, 2), 16);
    }

    eventValue() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    eventIndex() {
        return this.message.substr(9, 8)

    }

    eventVariableIndex() {
        return parseInt(this.message.substr(13, 2), 16);
        //return this.message.substr(13, 2)
    }

    getInt(start, length) {
        return parseInt(this.message.substr(start, length), 16);
    }

    getStr(start, length) {
        return this.message.substr(start, length)
    }

    index() {
        return parseInt(this.message.substr(13, 2), 16);
    }

    value() {
        return parseInt(this.message.substr(15, 2), 16);
    }

    data() {
        var data = [];
        var dataStr = this.message.substr(7, this.message.length - 7);
        for (var i = 0; i < dataStr.length - 1; i += 2)
            data.push(dataStr.substr(i, 2));
        return data;
    }

    messageOutput() {
        return this.message
    }
}

module.exports = {
    cbusMessage: cbusMessage
}