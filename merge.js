import inquirer from 'inquirer';
import {exec} from 'child_process';

const inquirerAction = async () => {
  const {action} = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Are you want to merge?',
      choices: ['YES', 'NO'],
    },
  ]);

  return action;
};

const inquirerSendingRepository = async () => {
  const {sendingRepository} = await inquirer.prompt([
    {
      type: 'list',
      name: 'sendingRepository',
      message: '보낼 브랜치 입력',
      choices: ['main', 'release'],
    },
  ]);

  return sendingRepository;
};

const inquirerReceivngRepository = async () => {
  const {receivngRepository} = await inquirer.prompt([
    {
      type: 'list',
      name: 'receivngRepository',
      message: '받을 브랜치 입력',
      choices: ['main', 'release'],
    },
  ]);

  return receivngRepository;
};

const inquireConfirmation = async (origin, next) => {
  const {confirmation} = await inquirer.prompt([
    {
      type: 'list',
      name: 'confirmation',
      message: `내용을 다시 확인하세요. 보낼 브랜치: ${origin} 받는 브랜치: ${next}`,
      choices: ['확인했어요', '다시 하기 위해서 종료할게요'],
    },
  ]);

  return confirmation;
};

(async () => {
  const action = await inquirerAction();

  const sendingRepository = await inquirerSendingRepository();

  const receivngRepository = await inquirerReceivngRepository();

  const confirmation = await inquireConfirmation(
    receivngRepository,
    sendingRepository,
  );

  console.log({
    action,
    receivngRepository,
    sendingRepository,
    confirmation,
  });

  // `gh workflow` 명령어를 실행하며 사용자에게 입력받은 값을 넘겨 줍니다.
  if (confirmation === '확인했어요') {
    exec(
      `gh workflow run merge --ref ${sendingRepository} -F SendingRepository=${sendingRepository} -F ReceivingRepository=${receivngRepository}`,
    );
  }
})();
