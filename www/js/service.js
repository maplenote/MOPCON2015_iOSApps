angular.module('starter.services', [])
  .factory('localStorageServ', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      setImage: function() {

      },
      getImage: function() {

      },
      removeAllJson: function(){
        for(key in $window.localStorage) {
          if(key.search(/^img\./)==-1) {
            $window.localStorage.removeItem(key);
          }
        }
      },
      removeAllImage: function() {
        for(key in $window.localStorage) {
          if(key.search(/^img\./)!=-1) {
            $window.localStorage.removeItem(key);
          }
        }
      }
    }
  }])
  .factory('loadingServ', function($ionicLoading) {
    var Service = {
      show: function() {
        //TODO 未完成
        return $ionicLoading.show({
          template:  "<div id='mopcon-loading'><img src='img/loading2.svg'></div>",
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      },
      hide: function() {
        return $ionicLoading.hide();
      }
    };
    return Service;
  })
  .factory('getDataServ', function($http,loadingServ,localStorageServ,$rootScope) {
    var Service = {
      getMenu: function() {
        return localStorageServ.getObject('menu');
      },
      getMopconInfo: function() {
        return localStorageServ.getObject('mopconInfo');
      },
      getServerInfo: function() {
        return localStorageServ.getObject('server');
      },
      getLastUpdateStatus: function() {
        var last = {};
        last.isSucc = localStorageServ.get('isSucc');
        last.saveLocalTime = localStorageServ.get('saveLocalTime');
        last.saveServerTime = localStorageServ.get('saveServerTime');
        return last;
      },
      getCtrlData: function(ctrl) {
        return localStorageServ.getObject('data.'+ctrl);
      },
      refreshAllData: function() {
        loadingServ.show();
        var localTime = new Date().getTime();
        var returnObj = $http.get("data/v2/data.json")
          .success( function(jsonData, status, headers, config) {
            if(jsonData.isSucc !== undefined
                && jsonData.isSucc==true
                && jsonData.server.appVersion == $rootScope.version) {
              //清除原本的資料
              localStorageServ.removeAllJson();
              localStorageServ.set('last.isSucc',true);
              localStorageServ.set('last.saveLocalTime',localTime);
              if(jsonData.server.serverTime!=undefined) {
                var serverDate = new Date(jsonData.server.serverTime);
                localStorageServ.set('last.saveServerTime',serverDate.getTime());
              }
              localStorageServ.setObject('server',jsonData.server);
              localStorageServ.setObject('mopconInfo',jsonData.mopconInfo);
              localStorageServ.setObject('menu',jsonData.menu);
              for(key in jsonData.data) {
                localStorageServ.setObject('data.'+key,jsonData.data[key]);
              }
              //整理 sessionDetail 資料，依照 id 排序
              //但防止 js 對數字陣列產生空的連續號，採用 string 的 key (no+數字id)
              if(jsonData.data.session != undefined) {
                var sessionDtList = {};
                var tempSu = jsonData.data.session;
                var dayList = {
                  "day1":jsonData.mopconInfo.start,
                  "day2":jsonData.mopconInfo.end
                }; //因為只有兩天，直接撈 mopconInfo.end

                //TODO 三層 for 好像有點醜，晚點再看 json 格式是不是需要調整
                for(var day = 1; day <= 2; day++) {
                  for(var tempC1 = 0; tempC1 < tempSu["day"+day].length; tempC1++) {
                    var tempDtGroup = tempSu["day"+day][tempC1];
                    for( var tempC2 = 0; tempC2 < tempDtGroup.section.length; tempC2++) {
                      var tempDt = tempDtGroup.section[tempC2];
                      if(tempDt.id != undefined && /^\d+$/.test(tempDt.id)) {
                        var tempKey = "no"+tempDt.id;
                        if(sessionDtList[tempKey] !== undefined) {
                          //TODO 若後端資料異常，id重複的話
                        }
                        sessionDtList[tempKey] = tempDt;
                        //不在這處理日期格式錯誤，改在 view 中處理
                        sessionDtList[tempKey].startDateTime = dayList['day'+day]+' '+tempDtGroup.startDateTime;
                        sessionDtList[tempKey].endDateTime = dayList['day'+day]+' '+tempDtGroup.startDateTime;
                      }
                      else {
                        //TODO 若後端資料異常，id不存在或不是數字
                      }
                    } //tempC2 for
                  } //tempC1 for
                } //day for
                localStorageServ.setObject('data.sessionDetail',sessionDtList);
              }
            }
            else {
              localStorageServ.set('last.isSucc',false);
              if(jsonData.server.app_version != $rootScope.version)
              {
                localStorageServ.set('last.errCode','E001');
              }
              else
              {
                if(jsonData.errCode!==undefined)
                {
                  localStorageServ.set('last.errCode',jsonData.errCode);
                }
              }
            }
          })
          .error( function(data, status, headers, xhr){
            if(status===undefined) //資料異常，可能是json格式錯誤
            {
              status = 404;
            }
            localStorageServ.set('last.isSucc',false);
            localStorageServ.set('last.errCode',status);
          })
          .finally( function(){
            localStorageServ.set('last.statusLocalTime',localTime);
            $rootScope.isSucc = localStorageServ.get('last.isSucc');
            //TODO 要提供 isSucc==false 的相關處理
            loadingServ.hide();
          });
        return returnObj;
      }
    };
    return Service;
  });
