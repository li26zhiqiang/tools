function opetion() {
    //
}

class Action {
    actions: Record<string, any> = {
        onGlobalStateChange: opetion,
        setGlobalState: opetion
    };

    setAction(actions: Record<string, any>) {
        this.actions = actions;
    }

    // 更新全局state，只有初始化存在的字段才能更新
    setGlobalState(...args: any[]) {
        this.actions.setGlobalState(args);
    }

    // 监听state变化
    onGlobalStateChange(...args: any[]) {
        this.actions.onGlobalStateChange(...args);
    }
}

const action = new Action();

export default action;
