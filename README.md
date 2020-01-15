- [项目结构](#%e9%a1%b9%e7%9b%ae%e7%bb%93%e6%9e%84)
  - [项目目录](#%e9%a1%b9%e7%9b%ae%e7%9b%ae%e5%bd%95)
- [数据爬取](#%e6%95%b0%e6%8d%ae%e7%88%ac%e5%8f%96)
  - [提前批](#%e6%8f%90%e5%89%8d%e6%89%b9)
    - [抓取各个省份的提前批院校显示网页](#%e6%8a%93%e5%8f%96%e5%90%84%e4%b8%aa%e7%9c%81%e4%bb%bd%e7%9a%84%e6%8f%90%e5%89%8d%e6%89%b9%e9%99%a2%e6%a0%a1%e6%98%be%e7%a4%ba%e7%bd%91%e9%a1%b5)
    - [解析网页](#%e8%a7%a3%e6%9e%90%e7%bd%91%e9%a1%b5)
    - [通过 typeId 获取各个批次的详细信息](#%e9%80%9a%e8%bf%87-typeid-%e8%8e%b7%e5%8f%96%e5%90%84%e4%b8%aa%e6%89%b9%e6%ac%a1%e7%9a%84%e8%af%a6%e7%bb%86%e4%bf%a1%e6%81%af)
    - [接口数据解析](#%e6%8e%a5%e5%8f%a3%e6%95%b0%e6%8d%ae%e8%a7%a3%e6%9e%90)
  - [各省份往年批次线](#%e5%90%84%e7%9c%81%e4%bb%bd%e5%be%80%e5%b9%b4%e6%89%b9%e6%ac%a1%e7%ba%bf)
    - [获取网页代码](#%e8%8e%b7%e5%8f%96%e7%bd%91%e9%a1%b5%e4%bb%a3%e7%a0%81)
    - [解析](#%e8%a7%a3%e6%9e%90)
  - [ucode 的获取 *](#ucode-%e7%9a%84%e8%8e%b7%e5%8f%96)
    - [获取接口数据](#%e8%8e%b7%e5%8f%96%e6%8e%a5%e5%8f%a3%e6%95%b0%e6%8d%ae)
  - [各个大学在各个省份的录取分数线](#%e5%90%84%e4%b8%aa%e5%a4%a7%e5%ad%a6%e5%9c%a8%e5%90%84%e4%b8%aa%e7%9c%81%e4%bb%bd%e7%9a%84%e5%bd%95%e5%8f%96%e5%88%86%e6%95%b0%e7%ba%bf)
    - [获取各个大学的id](#%e8%8e%b7%e5%8f%96%e5%90%84%e4%b8%aa%e5%a4%a7%e5%ad%a6%e7%9a%84id)
    - [解析](#%e8%a7%a3%e6%9e%90-1)
    - [爬取大学的分数线](#%e7%88%ac%e5%8f%96%e5%a4%a7%e5%ad%a6%e7%9a%84%e5%88%86%e6%95%b0%e7%ba%bf)
    - [解析](#%e8%a7%a3%e6%9e%90-2)
  - [爬取各个大学的专业分数线](#%e7%88%ac%e5%8f%96%e5%90%84%e4%b8%aa%e5%a4%a7%e5%ad%a6%e7%9a%84%e4%b8%93%e4%b8%9a%e5%88%86%e6%95%b0%e7%ba%bf)
    - [爬取专业分数线](#%e7%88%ac%e5%8f%96%e4%b8%93%e4%b8%9a%e5%88%86%e6%95%b0%e7%ba%bf)
    - [解析](#%e8%a7%a3%e6%9e%90-3)
# 项目结构
## 项目目录

![](https://note.youdao.com/yws/api/personal/file/WEB1be599a84d6b863c355a3af3b4adbe5b?method=download&shareKey=9c2b65346ea7f867f77e5a7fe791ade7)
- init.js ：用来初始化项目，主要是用来建立文件夹，比如`data`，`log`。需要在**项目运行前先运行该文件，以避免因为文件夹不存在引起 `fs` 模块的报错。**
- crawl: 数据爬取，其子文件夹如下：
  - data: 用来存储提前批、大学分数线、大学专业分数线、ucode等数据，其子文件夹的结果如下：
    - collegeScoreLines: 院校分数线数据。
    - preFraction：提前批数据。
    - professionScoreLines: 院校专业分数线信息。
    - ucode：大学在各省份对应的`ucode`。
    > 每个文件夹的子文件夹都是一样的，包括 `data`,`html`,`json`。用途如下：
    - data：用来存储接口获取的数据以及将数据解析后进行存储，有两个子文件夹：
      - encrypt：接口响应数据，是加密数据。
      - decrypt：将`encrypt`文件夹进行解析，其结构与`encrypt`一模一样。
    - html：如果需要爬取网页的源代码，那么就把页面的`.html`文件保存在该文件夹下。
    - json：将`html`文件夹中的代码进行解析，将需要的数据保存为自己想要的格式。
  - html: 存的是各个省份的id和名称的页面代码，从浏览器那里复制而来。
  - json：存放省份id和省份名称的json文件，使用频繁。
  - colleges.js: 获取院校分数线的`js`文件，需要单独运行，运行命令`node colleges.js`。
  - preFraction.js: 获取提前批数据的`js`文件，需要单独运行，运行命令`node preFraction.js`。
  - professions.js: 获取院校各专业分数线的`js`文件，需要单独运行，运行命令`node professions.js`。
  - ucode.js: 获取各个学校在各个省份对应的`ucode`的`js`文件，需要单独云南行，运行命令`node ucode.js`。
  - province.js：生成省份信息的json文件，放在`json`文件夹。需要单独运行，运行命令`node province.js`
- log：存放运行日志的文件夹，通过`init.js`生成该文件夹。
- services：从浏览器保存下来的`js`文件。
- utils: 用来解析密文，日志配置，程序等待等。

# 数据爬取
## 提前批
### 抓取各个省份的提前批院校显示网页

![](https://note.youdao.com/yws/api/personal/file/WEB6036c7c7c5311f5f942818d86018fac5?method=download&shareKey=ad4c6d40cf407b936b9a93eb78ea313d)
- 接口
  - request
    - url：https://ia-pv4y.youzy.cn/preFraction/index
    - method: get
    - header
        - Cookie: 需要有省份信息，**是必须的**
        ```js
        let p = { "provinceId": key, "provinceName": provinces[key], "isGaokaoVersion": false }
        let cookie = encodeURI(JSON.stringify(p))
        ```
    - params
        - p: 加密后的省份信息
        ```json
        let encryptP = common.youzyEpt(p)
        ```
        - toUrl: 固定参数，'/preFraction/index'
  - response
    - data: 请求到的数据，res.data 就可以拿到网页代码。
  
> 省份信息例子: { "provinceId": 842, "provinceName": '上海', "isGaokaoVersion": false }，isGaoKaoVersion 目前不清楚它的作用是什么，都是写固定为 false。

### 解析网页
- 分析爬取下来的网页代码，部分省份是没有提前批的院校信息的，所以最后没有生成该省份对应的`json`文件。
- json文件结构，**其中的 typeId 是用来获取批次信息的关键参数。**
```json
{
    "province": "安徽",
    "provinceId": "844",
    "name": "体育批本科",
    "colleges": [
        {
            "pcid": "828",
            "name": "体育类第一批(本科)",
            "pcxs": [
                {
                    "typeId": "829",
                    "name": "平行志愿投档前单独投档录取"
                },
                {
                    "typeId": "830",
                    "name": "平行志愿投档院校"
                }
            ]
        }
    ]
}
```
> 一个省份中有多种批次类别，如 体育批本科，艺术批本科，艺术批专科等。每种类别中又有多个学校，每个学校中又有多个批次，如 艺术类第四批，艺术类第五批。每个批次中又有多个项目，如 平行志愿投档前单独投档录取，平行志愿投档院校。可以看网站的批次信息页面，就可以更好地理解。

### 通过 typeId 获取各个批次的详细信息
- request
  - url: https://ia-pv4y.youzy.cn/Data/TZY/PreFraction/QueryWithApp
  - method: post
  - header
    - Cookie
    ```js
    // 请求头部添加省份信息的 cookie
    let p = { "provinceId": provinceId, "provinceName": provinceName, "isGaokaoVersion": false }
    let cookie = encodeURI(JSON.stringify(p))
    OPTIONS.headers = { 'Cookie': `YouzyPV_currentProvince=${cookie}` }
    ```
  - params
    - data: 加密后的请求参数，使用`common.youzyEpt(queryObj)`，queryObj 的内容如下
    ```js
    {
        typeId: typeId,
        pageIndex: 1,
        pageSize: PAGE_SIZE, // 网站是一页获取 5 条，所以这里也是遵循网页的方式
        provinceId: provinceId,
        year: year, 
        course: -1  // 这个应该是文科生还是理科生的标志位，这个接口没用到这个参数，所以用 -1 表示不碍事
    }
    ```
- response
    ```json
    "result": {
        "totalCount": 17,   // 该批次总共有几个学校
        "items": [
            {
                "types": [], // 不清楚
                "colleges": [  // 学校列表
                    {
                        "typeId": 100159, // 查询参数中的 typeId
                        "admissCode": "gc7nim29|c7olgo13|crp7qr19|scj7ng13|",  // 应该时学校编码
                        "collegeId": 907,
                        "collegeName": "【上】|cr6miobb|【电】|cnjs6r55|c6osr6qf|c6lrr7j4|",
                        "course": null,
                        "bzType": null,
                        "admissType": null,
                        "planNum": "crnqk2ej7a|", // 计划招生数
                        "cost": "-",
                        "learnYear": "-",
                        "remarks": "", // 备注
                        "majors": [
                            {
                                "majorCode": "", // 专业代码
                                "professionName": "【电】|ptnc6kb5|qpgsc684|otch6nd4|rbjrp3ca|linrc649|pgcl6ej4|gctlj659|prkc6r5c|",  // 专业名称
                                "professionCode": "jcj7q1o2|coil7s13|", // 专业代码
                                "professionDesc": "",
                                "chooseSubject": "",
                                "planNum": "kscoq2re7a|",
                                "cost": "gittc717|c7tspk12|mnchh712|kc7grm12|", // 学费
                                "learnYear": "c7kglr16|",  // 学年制
                                "remarks": "kioct6a9|【色】|【盲】|" // 备注
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ```
- 存储：每个省份都有一个对应的文件夹，每个省份的数据按每个大类去存储，如提前批本科作为一个`json`文件。
  
### 接口数据解析
- 用`parse-util`解密，跟接口响应数据的存储一样，每个省份都有一个对应的文件夹，每个省份的数据按每个大类去存储，如提前批本科作为一个`json`文件

## 各省份往年批次线
### 获取网页代码
- request
    - url: https://ia-pv4y.youzy.cn/scorelines/pcl
    - method: get
    - params
        - p: 省份信息
        ```js
        let encryptP = common.youzyEpt(p)
        ```
        - tcode: 省份id加密信息，**关键参数**
        ```js
        tcode = common.youzyept({ provinceid: id })
        ```
        - toUrl: 固定参数，'/scorelines/pcl'
- response
    - data: 爬取的网页代码

### 解析
- 所有的省份的结果都存在一个叫`score-lines.json`的文件

## ucode 的获取 *
> 每个大学在每个省份都有一个对应的 ucode，使用这个ucode，可以查询该大学在该省份的一些信息，如该大学在该省份的专业分数线，院校分数线
### 获取接口数据
- request
  - url: https://ia-pv4y.youzy.cn/Data/ScoreLines/UCodes/QueryList?p=abc
  - method: post
  - params
    - data: `common.youzyEpt()`加密`queryObj`后的字符串
    ```js
    queryObj = {
        provinceId: provinceId,
        collegeId: cid
    }
    ```
- response
  - 返回一个数组，使用下面的步骤可以拼接出正确的 ucode
    ```js
    const data = res.data.result
    if (data.length !== 0) {
        ucode = data[0].uCodeNum
        data.forEach(function (r) {
            var uCodeNumArr = r.uCodeNum.split('_').reverse()
            if (uCodeNumArr[0] == '0' && uCodeNumArr[1] == '0') {
                uCode = r.uCodeNum
            }
        })
    }
    ```


## 各个大学在各个省份的录取分数线
### 获取各个大学的id
- request
    - url: https://www.youzy.cn/tzy/search/colleges/collegeList
    - method: get
    - header
      - Cookie: **需要在`cookie`中加入随便一个省份的信息，不然会导致接口一直发生重定向去设置省份信息。**
      ```js
      'Cookie': 'Youzy2CCurrentProvince=%7B%22provinceId%22%3A848%2C%22provinceName%22%3A%22%E6%B2%B3%E5%8D%97%22%2C%22isGaokaoVersion%22%3Afalse%7D;'
      ```
    - params
      - page: 页面索引
    > 具体有多少页呢？可以先爬取第一个页面，然后获取第一个 \<strong>\</strong>标签的内容即为总页数。![](https://note.youdao.com/yws/api/personal/file/WEBc6a148aaef0ce64f5fd5994bddf45b6c?method=download&shareKey=7190ffafad8bd7ebc1da9acfd44359db)
- response
    - data: 爬取的网页源代码
### 解析
- 所有的大学结果都存在一个叫`colleges.json`的文件。

### 爬取大学的分数线
- request
  - url: http://ia-pv4y.youzy.cn/Data/ScoreLines/Fractions/Colleges/Query?p=abc
  - method: post
  - data: 加密参数 encryptP
  ```js
  encryptP = common.youzyEpt({
        provinceNumId: id,
        ucode: uCode // 每个大学在每个省份都一个 ucode
    })
  ```
- response
    ```js
    year: 2019  // 从 2012 到 2019
    course: 0   // 1 代表文科，0 代表理科
    batch: 1    // 批次，1 应该是第一批
    batchName: "本一批"  // 批次名称
    uCode: "41_838_0_0" // 该大学再该省份的 ucode
    chooseLevel: ""  // 不清楚
    lineDiff: 182  // 不清楚
    minScore: "ki6oifp732|lofioc6ra6|ssci2eqs7a|" // 最低分
    avgScore: 0
    maxScore: 0
    lowSort: "s7ss2reof1|p6pf7oo3p2|"  // 最低位次
    maxSort: 0  // 最高位次
    enterNum: "l7dkip3qae|se7loqlf11|" // 录取人数
    countOfZJZY: 0
    prvControlLines: 502  //不清楚
    ```
- 存储：每个省份的大学都放在同一个文件中，以省份的名字作为文件名
  
### 解析
- 存储：每个省份的大学都放在同一个文件中，以省份的名字作为文件名

## 爬取各个大学的专业分数线
### 爬取专业分数线
- request
  - url: http://ia-pv4y.youzy.cn/Data/ScoreLines/Fractions/Professions/Query?p=abc
  - method: post
  - params
    - data: `common.youzyEpt()`加密`queryObj`后的字符串
    ```js
    queryObj = {
        uCode: uCode, // 每个大学再每个省份对应的 ucode
        // batch: 0,  // 哪个批次，因为这里需要一次获取全部数据，所以这个参数可以不要
        courseType: courseType,  // 文科理科，0 是理科，1 是文科
        yearFrom: yearFrom, // 这个接口的时间是一个区间，查询出 [from ,to] 区间的数据，可以查具体某一年的数据，如 [2019, 2019]，也可以查出一个时间段的数据，如 [2012, 2018]
        yearTo: yearTo
    }
    ```
- response
  ```js
    year: 2018
    courseType: 1
    batch: 1
    batchName: "本一批"
    uCode: "41_838_0_0"
    chooseLevel: ""
    lineDiff: 129
    majorCode: "140109" // 专业代码，猜测应该是用来查询某个专业具体信息用的关键字段
    professionName: "" // 专业名称
    professionCode: "srocr712|cn7hoq13|" // 专业代码，页面显示用的
    remarks: null
    maxScore: "nhp6f7np32|aogaj86hoe|io6lnfj732|"
    minScore: "rn6flr7g32|nparska86e|r6tfnmq732|"
    avgScore: "6hlpfls732|morpaka86e|o6rrf73kq2|"
    lowSort: "c1ttm5fmj9|qqkao8hf2e|" // 该专业的最低排位
    maxSort: 0
    enterNum: "nncjs1j5f9|"  // 录取人数
    countOfZJZY: 0
  ```

- 存储：每个大学的`cid`作为文件名，将该大学各专业在各省份的招生情况保存起来，如`838.json`就是`北京大学（cid = 838）`的专业信息

### 解析
- 解析：每个大学的`cid`作为文件名，将该大学各专业在各省份的招生情况保存起来，如`838.json`就是`北京大学（cid = 838）`的专业信息