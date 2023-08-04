import styles from './index.module.less';
import help from '../../assets/images/help.png';
import movie from '../../assets/images/movie.png';
import word from '../../assets/images/word.png';
import code from '../../assets/images/code.png';
import robot from '../../assets/images/robot.png';

function Reminder() {
    const list = [
        {
            id: 'zhichangzhuli',
            icon: help,
            name: '职场助理',
            desc: '作为手机斗地主游戏的产品经理，该如何做成国内爆款？'
        },
        {
            id: 'dianyingjiaoben',
            icon: movie,
            name: '电影脚本',
            desc: '写一段电影脚本，讲一个北漂草根创业逆袭的故事'
        },
        {
            id: 'cuanxieduanwen',
            icon: word,
            name: '撰写短文',
            desc: '写一篇短文，用故事阐释幸福的意义'
        },
        {
            id: 'daimabianxie',
            icon: code,
            name: '代码编写',
            desc: '使用JavaScript写一个获取随机数的函数'
        }
    ];

    return (
        <div className={styles.reminder}>
            <h2 className={styles.reminder_title}>
                <img src={robot} alt="" />
                欢迎来到 {document.title}
            </h2>
            <p className={styles.reminder_message}>
                与AI智能聊天，畅想无限可能！基于先进的AI引擎，让你的交流更加智能、高效、便捷！
            </p>
            <p className={styles.reminder_message}>
                <span>Shift</span> + <span>Enter</span> 换行。开头输入 <span>/</span> 召唤 Prompt AI提示指令预设。
            </p>
            <div className={styles.reminder_question}>
                {list.map((item) => {
                    return (
                        <div key={item.id} className={styles.reminder_question_item}>
                            <img src={item.icon} alt="" />
                            <h3>{item.name}</h3>
                            <p>{item.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Reminder;
