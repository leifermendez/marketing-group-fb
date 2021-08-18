const groupModel = require('../models/group')
const groupLogModel = require('../models/groupLog')
const { consoleMessage } = require('../helpers/console')
const { errorCatch } = require('../helpers/errorHandle')
const moment = require('moment')

const getGroup = async (message) => {
    try {
        const { tag } = message

        const resDetail = await groupModel.findOne(
            {
                tag: { $in: tag.split(',') }
            },
            null,
            {
                sort: { lastInteractionAt: 1 }
            }
        )
        resDetail.lastInteractionAt = Date.now()
        resDetail.save()

        return resDetail
    } catch (e) {
        errorCatch(e)
    }
}

const checkLog = async ({ idGroup, message }) => { //138906596809905
    try {
        const now = moment()
        const gapMin = parseInt(process.env.GAP_MINUTES || 5);
        const checkMessage = await groupLogModel.findOne({ idGroup, message })
        if (checkMessage) return true;
        consoleMessage(`Not post Log: ${checkMessage}`, 'yellow')
        const [check] = await groupLogModel.find({ idGroup }, null, { sort: { lastInteractionAt: -1 }, limit: 1 })
        consoleMessage(`Check Log: ${check}`, 'yellow')
        if (!check) return false;
        const lastDate = now.diff(moment(check.lastInteractionAt), 'minutes');
        consoleMessage(`Check GAP Time ${lastDate} >= ${gapMin}`, 'yellow')
        return (lastDate < gapMin)
    } catch (e) {
        errorCatch(e)
    }
}

const saveLog = async ({ idGroup, message, account, linkHref }) => {
    const data = {
        idGroup,
        message,
        account,
        linkHref,
        lastInteractionAt: Date.now()
    }
    await groupLogModel.create(data)
}

const getAll = async () => {
    const list = await groupModel.find({})
    return list
}

const testCheckLog = async (idGroup) => {
    const check = await groupLogModel.findOne({ message: '👉aa TURBO Cache para tu Aplicacion de NODE' })
    console.log(check)
}

const testGetGroup = async (tag = []) => {
    const resDetail = await groupModel.findOne(
        {
            tag: { $in: tag.split(',') }
        },
        null,
        {
            sort: { lastInteractionAt: 1 }
        }
    )
    console.log(resDetail)
}

module.exports = { getGroup, saveLog, checkLog, getAll, testCheckLog, testGetGroup }