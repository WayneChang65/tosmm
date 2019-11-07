'use strict';

const _prefix = {
	type: 'flex',
	altText: '土司小妹-群組指令',
	contents: {}
};

// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
/* eslint-disable */
const _basicFrame = {
    "type": "bubble",
    "size": "mega",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "群組指令",
              "weight": "bold",
              "size": "xl",
              "margin": "md"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "image",
                      "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5DrIssZn4DIU90vpuUhvuqa9shsfdmzBT8yDRxIzPMU9l3Ofb&s",
                      "size": "xxs",
                      "flex": 3
                    },
                    {
                      "type": "text",
                      "text": "主人好，我是土司小妹ロボ。",
                      "style": "normal",
                      "decoration": "none",
                      "flex": 27,
                      "color": "#9F0050"
                    }
                  ]
                },
                {
                  "type": "text",
                  "text": "很高興為主人們服務。",
                  "color": "#9F0050"
                }
              ],
              "margin": "md"
            }
          ]
        },
        {
          "type": "separator",
          "margin": "xs"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": "以下是群組專屬指令：",
              "weight": "bold",
              "size": "lg"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "群組指令",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "本說明",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "群組狀態",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "BJ4",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "1:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 天氣預報",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "3:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 抽美女",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "4:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 抽帥哥",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "5:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 神魔抽卡",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "6:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 抽籤",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "7:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 運勢",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "8:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 AI回應",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "9:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 討伐催房",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "11:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 PTT新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "12:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 巴哈新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#000000",
                  "text": "13:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 官網新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "14:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 G8Gl新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "separator",
              "color": "#e0e0e0"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "121:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 PTT自動新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "122:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 巴哈自動新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "123:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 官網自動新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "flex": 5,
                  "color": "#3A006F",
                  "text": "124:on/off",
                  "style": "italic",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "啟閉 G8G自動新訊",
                  "flex": 6,
                  "color": "#000000"
                }
              ],
              "margin": "xs"
            }
          ],
          "offsetTop": "-10px"
        },
        {
          "type": "button",
          "action": {
            "type": "uri",
            "label": "詳細用法詳見參考網站",
            "uri": "https://ppt.cc/fALMzx"
          },
          "margin": "none",
          "height": "sm",
          "style": "secondary"
        }
      ]
    },
    "styles": {
      "footer": {
        "separator": true
      }
    }
};
/* eslint-enable */

function _msg() {
	_prefix.contents = _basicFrame;
	return _prefix; 
}

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};

