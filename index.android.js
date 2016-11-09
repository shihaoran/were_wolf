/**
 * Created by Qingchang Han on 2016/10/30.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio
} from 'react-native';

import dva from 'dva/mobile';
import {
    Scene,
    Router,
    Actions,
} from 'react-native-router-flux'
import roomModel from './src/models/RoomModel';
import gameModel from './src/models/room';
import infoModel from './src/models/infoModle';

//启动
import Launch from './src/components/Launch';
//导航栏
import TabIcon from './src/components/TabIcon';

//房间
import RoomList from './src/components/RoomList';
import Room from './src/components/Room';
//游戏
import CARoom from './src/components/Create_AddRoom';
import GameRoom from './src/components/GameRoom';
//个人信息
import MyInfo from './src/components/MyInfo';
import EditInfo from './src/components/EditInfo';
import MyFriend from './src/components/MyFriend';
import MyRecord from './src/components/MyRecord';
import Setting from './src/components/Setting';




// 1. Initialize
const app = dva();

// 2. Model
app.model(roomModel);
app.model(gameModel);
app.model(infoModel);

// 3. View
class App extends Component {
  render() {
    return (
        <Router>
          <Scene key="root">
            <Scene key="Launch" component={Launch} initial={infoModel.state.ifLogin === false} hideNavBar/>
            <Scene
                key="tabbar"
                tabs
                tabBarStyle={styles.tabBarStyle}
                tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                initial={infoModel.state.ifLogin === true}
            >
              <Scene
                  key="RoomPage"
                  title="房间"
                  hideNavBar
                  icon={TabIcon}
              >
                <Scene key="RoomTab" hideNavBar>
                  <Scene key="RoomList" component={RoomList} />
                </Scene>
              </Scene>
              <Scene
                  key="GamePage"
                  title="游戏"
                  hideNavBar
                  icon={TabIcon}
              >
                <Scene key="GameTab" hideNavBar>
                  <Scene key="CARoom" component={CARoom} />
                  <Scene key="GameRoom" component={GameRoom} hideTabBar/>
                </Scene>
              </Scene>
              <Scene
                  key="MinePage"
                  title="我的"
                  icon={TabIcon}
                  hideNavBar
              >
                <Scene key="MineTab" hideNavBar>
                  <Scene key="MyInfo" component={MyInfo} />
                  <Scene key="EditInfo" component={EditInfo} hideTabBar/>
                  <Scene key="MyFriend" component={MyFriend} hideTabBar/>
                  <Scene key="MyRecord" component={MyRecord} hideTabBar/>
                  <Scene key="Setting" component={Setting} hideTabBar/>
                </Scene>
              </Scene>
            </Scene>
          </Scene>
        </Router>
    );
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    alignItems: 'center',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
});


// 4. Router
app.router(() => <App />);

// 5. Start
AppRegistry.registerComponent('were_wolf', () => app.start());