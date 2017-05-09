var app = angular.module("WebsocketApp", ['ngRoute']);

app.controller("MainCtrl", function ($scope, $log) {
    $scope.chatLog = [];
    $scope.chatMessage = "";
    var ws = null;
    var isWsOpen = false;

    $scope.initWebsocket = function () {
        if ("WebSocket" in window) {
            $scope.chatLog.push({message: "WebSocket is supported by your Browser!", type: "initialization"});

            try {
                // Let us open a web socket
                ws = new WebSocket("ws://localhost:8001");
                registerEventHandlers(ws);
            } catch (e) {
                $scope.chatLog.push({message: e, type: "error"});
            }
        }
        else {
            // The browser doesn't support WebSocket
            $scope.chatLog.push({message: "WebSocket NOT supported by your Browser!", type: "error"});
        }
    }

    $scope.sendChatMessage = function() {
        if("" != $scope.chatMessage.trim() && isWsOpen == true) {
            ws.send($scope.chatMessage);
            $scope.chatLog.push({message: "YOU: "+$scope.chatMessage, type: "info"});
            $scope.chatMessage = "";
        } else if(isWsOpen == false) {
            $scope.chatLog.push({message: "Connect to WebSocket before sending messages!", type: "error"});
        } else {
            $scope.chatLog.push({message: "Type a message to send!", type: "error"});
        }
    }

    function registerEventHandlers() {
        ws.onopen = function () {
            isWsOpen = true;
            // Web Socket is connected, send data using send()
            $scope.chatLog.push({message: "You may start sending messages", type: "info"});
            $scope.$apply();
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            $scope.chatLog.push({message: "THEM: "+evt.data, type: "them-info"});
            $scope.$apply();
        };

        ws.onclose = function () {
            isWsOpen = false;
            // websocket is closed.
            $scope.chatLog.push({message: "Connection is closed...", type: "error"});
            $scope.$apply();
        };
    }

    $scope.clearChat = function() {
        $scope.chatLog = [];
    }
});