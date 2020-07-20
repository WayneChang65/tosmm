<p align="center">
  <img src="https://raw.githubusercontent.com/WayneChang65/tosmm/master/img/mm640.png">
</p>
<h1 align="center">土司小妹ロボ</h1>

<p align="center">這是一個<b>LINE機器人</b>，主要提供<b>神魔之塔</b>遊戲相關的群組服務。</p>

# tosmm  
[![GitHub](https://img.shields.io/github/v/tag/waynechang65/tosmm)](https://github.com/WayneChang65/tosmm/releases)
[![GitHub](https://img.shields.io/github/license/waynechang65/tosmm)](https://github.com/WayneChang65/tosmm/)

這是一個LINE機器人([LINE](https://line.me/zh-hant/) bot)，主要提供[神魔之塔](https://towerofsaviors.com/)遊戲相關的群組服務。除此之外，也是個人在業餘為了滿足軟體工程師靈魂所打造的小玩具。  

## 前言 (Overview)  
**土司小妹ロボ Line群組機器人** 被製作出來與被使用已超過二年了，初期功能不多，只在友好的幾個群組(蘇坦納超人, FirstBlood, ...)中被測試與使用。後來，漸漸越多群組加入之後，依使用者需求回饋，功能也越來越完整，甚至連群組管理者的功能都加上去。
**土司小妹ロボ Line群組機器人** 主要的目的很簡單，就是.... **為了讓遊戲群組能更熱鬧**、讓群組內的交流能更多，並且在群組中激發點樂趣....嗯，是否注意到哪兩個字被說了三次？"群組"，對，就是群組。土司小妹ロボ就是為"群組"而生，所以要使用她，必須將她加入群組。  

另外，也設立了FB粉絲團，提供一個事項建議或問題解答的窗口。[土司小妹](https://www.facebook.com/TosMM.Linebot)  

## 開放原始碼 (Open Source)
希望更多人發揮創意，希望更多人可以讓這個專案更完整。   
自己從開放式原始碼學習到相當相當多知識，從中收穫不少。因此，開放原始碼一直是規畫中的事。不過，各位也知道，宅男工程師寫Code容易，寫文件或整理資料可難如登天。要開放原始碼，就要把Code進行整理，就猶如把萬年倉庫清理一般地困難。~~好吧，從規畫要開放程式碼到現在也超過半年了~~... >.<  

雖然拖拖拖拖個老半天，至少現在也成功開放了。(汗)

## 詳細的功能說明 (Feature)  
請參考以下網站  
[土司小妹ロボ功能介紹](http://wayne65.ap.ngrok.io/wp/%e5%9c%9f%e5%8f%b8%e5%b0%8f%e5%a6%b9%e3%83%ad%e3%83%9c%e5%8a%9f%e8%83%bd%e4%bb%8b%e7%b4%b9/)  
<p align="center">
  <img src="https://raw.githubusercontent.com/WayneChang65/tosmm/master/img/tosmm.gif" width="30%" height="30%">
</p>

## 安裝與執行 (Install and Run)
* 首先在執行這個程式的使用者家目錄(Home Directiory)下，置入名為**client_secret.json**檔案。這個檔案，是針對存取Google Spreadsheet所需要的認證碼。(要到Google網站申請)  

* 設定以下環境變數。因為其中用到LINE、Google Spreadsheet、Bitly，所以必須要申請這些服務的Access Key/Token。也會用到相關的圖片資料，所以要有相關的圖床URL(Line規定要https)。  

```javascript
##########################################
#        TosMM Linebot Keys              #
##########################################

# Super User的群組idx (通常機器人加第一個群組，這群組編號就是0)
export TOSMM_SU_GIDX="0"
# 本服務開啟的Port (Port可改)
export PORT_WATER="3210"
# LINE Channel ID
export CHANNEL_ID_WATER="15xxxxxxx"
# LINE Channel Secret
export CHANNEL_SECRET_WATER="0a3exxxxxxxxxxxxxxxxxx"
# LINE Channel Access token
export CHANNEL_ACCESS_TOKEN_WATER="hLxxxxxxxxxxxxx"
# 測試用頻道 Super User的群組idx。(以實際編號為主) (Optional)
export TOSMM_SU_GIDX_FIRE="633"
# 測試用頻道 服務開啟的Port (Port可改) (Optional)
export PORT_FIRE="3310"
# 測試用頻道 LINE Channel ID (Optional)
export CHANNEL_ID_FIRE="16xxxxxxxxx"
# 測試用頻道 LINE Channel Secret (Optional)
export CHANNEL_SECRET_FIRE="797xxxxxxxxxxxxxxx"
# 測試用頻道 LINE Channel Access token (Optional)
export CHANNEL_ACCESS_TOKEN_FIRE="srd5xxxxxxxxxxxxxxxxxx"
# LINE Client APP User ID
export CLIENT_APP_USER_ID="U8xxxxxxxxxxxxxxxxxxxx"

##########################################
#        Path of drawing cards           #
##########################################

# 神魔之塔抽卡系列的圖片代碼 (代表圖片目錄名稱)
export TOSMM_TORO_SERIES="deo"
# 神魔之塔相關圖片目錄最上層URL
export TOSMM_TORO_PIC_PATH="https://xxx.xxx.xxx/lb_images/"
# 神魔之塔抽卡圖片URL
export TOSMM_TORO_PIC_PATH_TOS="https://xxx.xxx.xxx/lb_images/tos_img/"
# 抽卡機率 圖片URL
export TOSMM_TORO_PIC_PATH_TCHANCE="https://xxx.xxx.xxx/lb_images/tosp_img/toro.jpg"
# 加倍機率 圖片URL
export TOSMM_TORO_PIC_PATH_TCHANCED="https://xxx.xxx.xxx/lb_images/tosp_img/toro_d.jpg"
# 運勢 圖片URL
export TOSMM_TORO_PIC_PATH_ASA="https://xxx.xxx.xxx/lb_images/asa_img/"
# 超人運勢 圖片URL
export TOSMM_TORO_PIC_PATH_SM_ASA="https://xxx.xxx.xxx/lb_images/sm_asa_img/"
# 抽籤 圖片URL
export TOSMM_TORO_PIC_PATH_KUZI="https://xxx.xxx.xxx/lb_images/kuzi_img/"
# 暫存檔 URL
export TOSMM_TORO_PIC_PATH_TEMP="https://xxx.xxx.xxx/lb_images/tos_img/temp/"
# LINE Flex使用的圖片 URL
export TOSMM_TORO_PIC_PATH_FLEX="https://xxx.xxx.xxx/lb_images/flex/"

##########################################
#          Email Bug Report              #
##########################################

export BUG_REPORT_EMAIL_USER="waxxxxxx"
export BUG_REPORT_EMAIL_PASSWORD="yxxxxxxxxx"
export BUG_REPORT_EMAIL_SERVER_PORT="465"
export BUG_REPORT_EMAIL_HOST="smtp.gmail.com"
export BUG_REPORT_EMAIL_SSL="true"
export BUG_REPORT_EMAIL_FROM="土司小妹 <username@your-email.com>"
export BUG_REPORT_EMAIL_TO="Wayne <xxxxx@gmail.com>"
export BUG_REPORT_EMAIL_CC="Wayne_CC <xxxxxxx@gmail.com>"

##########################################
#   BITLY Keys - Shorten hyper-links     #
##########################################

export TOSMM_BITLY_KEY="652xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_1_KEY="98xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_2_KEY="690xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_3_KEY="750xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_4_KEY="d71xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_5_KEY="464xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_6_KEY="7e3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_BITLY_7_KEY="037xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

##########################################
#        Google Spreadsheet IDs          #
##########################################

export TOSMM_GSID_WTESTWATER="1Bjxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_SUPERMAN="1qvxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_MAGGYBAN="1Kuxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_LIULUNG="14ixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_YOSEITAIL="1xAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_FUGUAN="1d2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export TOSMM_GSID_AUSHE="1zVxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  
```

* 從Github下載程式碼 
```
git clone https://github.com/WayneChang65/tosmm.git
```

* 進入tosmm目錄
```
cd tosmm
```

* 安裝json檔案 (群組與使用資料存取)
```
git clone https://github.com/WayneChang65/tosmm_empty_json.git json
```

* 安裝執行環境套件
```
npm install
```

* 執行程式
```
node index.js water
```

* 通常會遇到的問題
  * **程式跑起來有錯誤** ==> 先檢查是否所有環境變數都正確設定，相關服務的Secret是否正確。
  * **抽卡的圖出不來** ==> 檢查環境變數相關的URL是否正確，而且要*https*。
  * **管理者相關的指令無效** ==> 確認環境變數中 TOSMM_SU_GIDX是否正確被設定。(如果這個機器人只要加第一個群組，通常設定0。)
  * **設定固定時間的Timer時間不太對** ==> 因為我的系統時間是英國時間(BST)，所以跟台灣有8小時時差。解法有兩種，將您的系統時間設定為英國，或是改Code.
  * **不想申請這麼多服務Secret，也不想Run這麼多功能，該怎麼做？** ==> 即然您有興趣，且都Clone Code了，就手動把相關的地方Mark掉即可。您可以辦得到的。  


## LOGO   
[Tony @a032356469](https://twitter.com/a032356469)：土司小妹ロボ大頭貼設計者，也是一名專業畫師  

## 貢獻一己之力 (Contribution)
tosmm 應該是本人自己業餘寫過最大的專案了，從無中生有到現在亭亭玉立了。不過，她尚未完美，因此希望這個專案能夠持續進步！若有發現臭蟲(bug)或問題，請幫忙在Issue留言告知詳細情形。  
歡迎共同開發。歡迎Fork / Pull Request，謝謝。:)  
