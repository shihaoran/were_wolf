# -*- coding:UTF-8 -*-
import demjson
import glob
import send_message
from app_db.models import RoomInfo

#游戏是否结束的判断也放在这里
#先改变状态之后，再把上个状态发生的操作一起发回去。

#type = 0  正常+1
#type = 1  狼人自爆

#先不考虑角色死亡的情况???
#游戏结束也待考虑???
def change(type,r_id):

    room = RoomInfo.objects.get(room_id = r_id)
    round = room.round
    state = room.state
    rule = room.rule


    #游戏结束的判断
    owner_id = glob.room_owner_id[r_id]
    id_list = glob.room_mark[r_id].keys()
    game_over = True   #True 代表结束
    if owner_id not in id_list:     #房主离开游戏
        message = {'type': '12', 'room_request_id': str(glob.room_request_id[r_id]),
                   'reason': '3', 'request_content':glob.room_request_content[r_id]}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        return

    #判断狼人是否还有存活的
    for i in range(len(id_list)):
        role = glob.user_role[id_list[i]]
        alive = glob.user_alive[id_list[i]]
        if role == 'wolf' and alive == 'true':
            game_over = False
            break
    if game_over == True:
        message = {'type': '12', 'room_request_id': str(glob.room_request_id[r_id]),
                    'reason': '1', 'request_content': glob.room_request_content[r_id]}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        return

    game_over = True

    if rule == 0:
        for i in range(len(id_list)):
            role = glob.user_role[id_list[i]]
            alive = glob.user_alive[id_list[i]]
            if role != 'wolf' and alive == 'true':
                game_over = False
                break
    else:
        for i in range(len(id_list)):
            role = glob.user_role[id_list[i]]
            alive = glob.user_alive[id_list[i]]
            if role != 'wolf' and role != 'village' and alive == 'true':
                game_over = False
                break

    if game_over == True:
        message = {'type': '12', 'room_request_id': str(glob.room_request_id[r_id]),
                    'reason': '0', 'request_content': glob.room_request_content[r_id]}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        return


    #状态转移
    role_alive = 'true'

    #求各种角色的状态
    cupid_alive = 'false'
    guard_alive = 'false'
    witch_alive = 'false'
    seer_alive = 'false'
    hunter_alive = 'false'
    for i in range(len(id_list)):
        role = glob.user_role[id_list[i]]
        alive = glob.user_alive[id_list[i]]
        if role == 'cupid':
            cupid_alive = alive
        elif role == 'guard':
            guard_alive = alive
        elif role == 'witch':
            witch_alive = alive
        elif role == 'seer':
            seer_alive = alive
        elif role == 'hunter':
            hunter_alive = alive


    if state == 1:
        state = state+1
    elif state == 2:
        state = state+1
    elif state == 3:    #查看手牌
        if glob.room_role_number[r_id]['cupid'] == 0:
            if glob.room_role_number[r_id]['guard'] == 0:
                state = 7
            else:
                state = 6
                role_alive = guard_alive
        else:
            state = state+1
            role_alive = cupid_alive
    elif state == 4:    #丘比特
        #待处理
        state = state+1
    elif state == 5:    #情侣
        if glob.room_role_number[r_id]['guard'] == 0:
            state = 7
        else:
            state = state+1
            role_alive = guard_alive
    elif state == 6:    #守卫
        state = state+1
    elif state == 7:    #狼人
        if glob.room_role_number[r_id]['witch'] == 0:
            if glob.room_role_number[r_id]['seer'] == 0:
                if round == 1:
                    state = 10
                else:   #判断猎人死没死
                    if glob.room_role_number[r_id]['hunter'] != 0 and hunter_alive == 'false':
                        state = 15
                    else:
                        state = 10
            else:
                state = 9
                role_alive = seer_alive
        else:
            state = state+1
            role_alive = witch_alive
    elif state == 8:    #女巫
        if glob.room_role_number[r_id]['seer'] == 0:
            if round == 1:
                state = 10
            else:  # 判断猎人死没死
                if glob.room_role_number[r_id]['hunter'] != 0 and hunter_alive == 'false':
                    state = 15
                else:
                    state = 10
        else:
            state = state+1
            role_alive = seer_alive
    elif state == 9:    #预言家
        if round == 1:
            state = 10
        else:  # 判断猎人死没死
            if glob.room_role_number[r_id]['hunter'] != 0 and hunter_alive == 'false':
                state = 15
            else:
                state = 10
    elif state == 10:
        if type == 1:
            state = boom(r_id)
        else:
            state = state+1
    elif state == 11:
        if type == 1:
            state = boom(r_id)
        else:
            state = state+1
    elif state == 12:
        if type == 1:
            state = boom(r_id)
        else:
            if round == 1: #第一天
                if glob.room_role_number[r_id]['hunter'] != 0 and hunter_alive == 'false':
                    state = 15
                else:
                    #猎人死跳15，不然还是16
                    state = 16
            else:
                state = state+1
    elif state == 13:
        if type == 1:
            state = boom(r_id)
        else:
            state = state+1
    elif state == 14:       #不能自爆
        #猎人死
        if glob.room_role_number[r_id]['hunter'] != 0 and hunter_alive == 'false':
            state = 15
        else:
            state = 16
    elif state == 15:       #不能自爆
        if round == 1:
            state = 16
        else:
            state = 13
    elif state == 16:       #遗言不能自爆
        if round == 1:
            state = 13
        else:
            state = boom(r_id)
        round = round + 1
    else:
        message = {'type': '1', 'room_request_id': str(glob.room_request_id[r_id]),
                   'user_id': '-1','error_message':'error in room state'}
        json = demjson.encode(message)
        send_message.send(r_id, json)
        return


    room.round = round
    room.state = state
    room.save()



    message = {'type':'5','room_request_id':str(glob.room_request_id[r_id]),'room_state':room.state,
               'role_alive':role_alive,'request_content':glob.room_request_content[r_id]}
    json = demjson.encode(message)
    send_message.send(r_id,json)
    glob.room_request_content[r_id] = []
    return



def boom(r_id):
    state = 0
    if glob.room_role_number[r_id]['cupid'] == 0:
        if glob.room_role_number[r_id]['guard'] == 0:
            state = 7
        else:
            state = 6
    else:
        state = 4

    return state
