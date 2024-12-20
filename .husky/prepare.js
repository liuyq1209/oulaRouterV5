const { exec } = require('child_process')

// husky 权限处理
if (process.platform !== 'win32') {
  exec('chmod ug+x .husky/*', (error) => {
    if (error) {
      throw error
    }
  })
}