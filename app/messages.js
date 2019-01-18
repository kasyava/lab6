//const express = require("express");
import express from "express";
import nanoid from "nanoid";
const router = express.Router();

const fsDemo = require("../fsDemo");
const messagesCount =30;

const data = [];
/** Init DB on startup**/
fsDemo.init(data, ()=>{
    console.log("Init db");
    data.sort((a,b) => (a.datetime > b.datetime) ? 1 : ((b.datetime > a.datetime) ? -1 : 0)); //sort our array by date
});

/** GET request on /messages url**/
router.get('/', (req, res) =>{
    let tmpData = [];
    let dateTimeParam = req.query.datetime;
    if(dateTimeParam){
        for (let i = 0; i < data.length; i++) {
            let dateFromDB = Date.parse(data[i].datetime);
            let dateFromRequest =  Date.parse(dateTimeParam);
            if(isNaN(dateFromRequest)){
                res.status(400).send(JSON.parse(`{"error": "invalid date"}`));
                return;
            }
            else{
                if (dateFromDB > dateFromRequest) {
                    tmpData.push(data[i]);
                }
            }
        }
    }
    else {
        if (data.length > messagesCount) {
            for (let i = data.length - messagesCount; i < data.length; i++) {
                tmpData.push(data[i]);
            }
        } else tmpData = data.slice();
    }
    res.send(tmpData);
});

/** GET request on /messages/all **/
router.get('/all', (req, res) =>{
    res.send(data);
});

/** POST request on /messages **/
router.post('/', (req, res) =>{
    fsDemo.checkMessage(req.body,(answer) =>{
       if (answer.code ===400) {

           res.status(400).send(JSON.parse(`{"error": "${answer.error}"}`));

       }
       else{
           req.body.id = nanoid();
           req.body.datetime = new Date().toISOString();

           fsDemo.addItem(data, req.body);

           fsDemo.saveData(req.body, ()=>{
               res.send(req.body);
           });
       }
    });

});

export default router;