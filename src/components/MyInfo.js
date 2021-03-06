/**
 * Created by Qingchang Han on 2016/11/1.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

const MyInfo = (props) => {
    const { dispatch, information } = props;
    function onPress() {
        console.log('press');
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    我的信息
                </Text>
            </View>
            <View style={styles.separation}></View>
            <View style={styles.portraitContainer}>
                <TouchableOpacity onPress={onPress}>
                    <Image source={require('../images/wolf.png')} style={styles.head_portrait}/>
                </TouchableOpacity>
                <View style={styles.portraitTextContainer}>
                    <Text style={styles.nickname}>
                        昵称：{information.nickname}
                    </Text>
                    <Text style={styles.introduce}>
                        个人简介：{information.introduce}
                    </Text>
                </View>
            </View>
            <View style={styles.separation}></View>
            <TouchableOpacity onPress={Actions.EditInfo}>
                <View style={styles.editContainer}>
                    <Image source={require('../images/edit.png')} style={styles.iconEdit} />
                    <Text style={styles.iconText}>
                        编辑我的资料
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity onPress={Actions.MyFriend}>
                <View style={styles.editContainer}>
                    <Image source={require('../images/person.png')} style={styles.iconNormal} />
                    <Text style={styles.iconText}>
                        查看我的好友
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <TouchableOpacity onPress={Actions.MyRecord}>
                <View style={styles.editContainer}>
                    <Image source={require('../images/form.png')} style={styles.iconNormal} />
                    <Text style={styles.iconText}>
                        查看我的战绩
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.separation}></View>
            <TouchableOpacity onPress={Actions.Setting}>
                <View style={styles.editContainer}>
                    <Image source={require('../images/setting.png')} style={styles.iconNormal} />
                    <Text style={styles.iconText}>
                        设置
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    //页面框架
    container:{
        flex: 1,
        backgroundColor: '#ebebeb',
    },
    //标题
    header: {
        height: PixelRatio.get() * 16,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#393a3f',//#0033ff
    },
    //标题文本
    headerText: {
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: 18,
    },
    //分隔区
    separation: {
        backgroundColor: '#ebebeb',
        height: PixelRatio.get() * 8,
    },
    //头像区
    portraitContainer:{
        flexDirection: "row",
        width: Dimensions.get('window').width,
        height: PixelRatio.get() * 30,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    //头像
    head_portrait:{
        width: PixelRatio.get() * 25,
        height: PixelRatio.get() * 25,
        marginLeft: PixelRatio.get() * 3
    },
    //头像文字区
    portraitTextContainer:{
        height: PixelRatio.get() * 30,
        width: Dimensions.get('window').width - PixelRatio.get() * 24,
        flexDirection: 'column'
    },
    nickname:{
        fontSize: 18,
        marginLeft: PixelRatio.get() * 2,
        marginTop: PixelRatio.get() * 5
    },
    introduce:{
        fontSize: 16,
        color: '#c1c1c1',
        marginLeft: PixelRatio.get() * 2,
        marginTop: PixelRatio.get() * 3
    },
    editContainer: {
        marginTop: 5 / PixelRatio.get(),
        flexDirection: "row",
        width: Dimensions.get('window').width,
        height: PixelRatio.get() * 20,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    iconEdit: {
        marginLeft: PixelRatio.get() * 5,
        height: PixelRatio.get() * 5 / 1.235,
        width: PixelRatio.get() * 5
    },
    iconNormal: {
        marginLeft: PixelRatio.get() * 5,
        height: PixelRatio.get() * 5,
        width: PixelRatio.get() * 5
    },
    iconText: {
        marginLeft: PixelRatio.get() * 5,
        fontSize: 18
    }
});

export default connect(information => information)(MyInfo);