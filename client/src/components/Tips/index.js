import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './index.css'


function Tips(props){

    const {categories,returnResult,getTinybar,getReturnResult,getFathervalue} = props

    return (
        <div className="nav-tinybar">
        <ul>
          {categories.map((item, index) => {
            return (
              <li
                key={index}
                className={returnResult.indexOf(item) == -1 ? "" : "active"}
                onClick={() => {
                  if (returnResult.indexOf(item) == -1) {
                    getReturnResult(returnResult.concat(item));
                    getTinybar(item);
                  } else {
                    let index = returnResult.indexOf(item);
                    console.log(index, "test");
                    let result = returnResult.splice(index, 1);
                    console.log(returnResult);
                    if (result == "距离最近") {
                        getTinybar("智能排序");
                    } else {
                        getTinybar("不限");
                        getFathervalue("不限");
                    }
                  }

                  // setTinybar("")
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    )
}

export default Tips