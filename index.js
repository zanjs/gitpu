var chalk = require('chalk');
var test = require('child_process').exec;

var emoji = require('./js/emoji').emoji,
    commit = require('./js/commit').commit,
    emojiLenth = emoji.length,
    randomNum = GetRandomNum(0,emojiLenth),
    commitUI = commit[GetRandomNum(0,commit.length)],
    emojiUI = emoji[randomNum];




var check = test('git add -u -n', function(err, stdout, stderr){
  if(stdout.length == 0)
    console.log(chalk.red.bold('No Files Modified.'));

    argvtest();
});

function GetRandomNum(Min,Max){
  var Range = Max - Min;
  var Rand = Math.random();
  return(Min + Math.round(Rand * Range));
}


function argvtest() {
  var commitMsg = process.argv[2];
  if(commitMsg){
         commitMsg = commitMsg.trim();      
  }
  if(!commitMsg)
    commitMsg = commitUI;
 autogit(commitMsg);
}

function autogit(commitMsg) {
  var spawn = require('child_process').spawn;
  var st,sTime;

  sTime = new Date().getTime();
  console.log(new Date()+'\nstart || 开始执行...');

  var status = spawn('git', ['status', '-s', '-uno']);

  status.stdout.on('data', function(data){
    st = data.toString().split('\n');
    for(i=0;i<st.length;i++) {
      console.log(chalk.red(st[i].trim()));
    }
  });

  status.on('close', function(){
    //var add = spawn('git', ['add', '-u', '-v']);
    var add = spawn('git', ['add', '.']);
    add.stdout.on('data', function(data){
      console.log(chalk.blue(data.toString()));
    });

    add.on('close', function(){
        
          var pull = spawn('git', ['pull']);
          
           pull.stdout.on('data', function(data){
               console.log(chalk.blue(data.toString()));
           });
        
           pull.on('close', function(){ 
                     var fstr = commitMsg.substr(0,1);
                     if(fstr != "#"){
                         commitMsg = commitMsg + emojiUI
                     } 
                                 
                    var commit = spawn('git', ['commit', '-m', commitMsg]);
                    commit.on('close', function(){
                            console.log(chalk.green.bold('git commit ok \n 正在提交到远程仓库 \n loading push...'));

                            var push = spawn('git', ['push']);

                            push.stdout.on('data', function(data){
                            console.log(chalk.blue(data.toString()));
                            });

                            var isok = true;

                            push.stderr.on('data', function(data){
                                var stc = data.toString();
                                console.log('[stderr]♣♣:'+chalk.blue(stc));
                                if(stc == 'Everything up-to-date'){
                                    console.log('isok ='+ false);
                                    isok = false;
                                }

                            });


                            push.on('close', function(){
                            //console.timeEnd("push-time");
                            if(isok == false) return;

                            var eTime = new Date().getTime(),
                                useTime = eTime - sTime;
                            console.log(chalk.green.bold('git push ok \n time cost: '+useTime +'ms\n恭喜您：推送完成 || 耗时 '+ useTime/1000 +'秒\n更多信息请看上面stderr:信息提示'));
                            });

                    });
          });
    });
  });
}
