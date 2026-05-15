import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'

import './index.scss'

export default function IndexPage () {
  useLoad(() => {
    console.log('Dreamscape index page loaded.')
  })

  const handleStart = () => {
    Taro.showToast({
      title: '小程序骨架已就绪',
      icon: 'none'
    })
  }

  return (
    <View className='page'>
      <View className='hero'>
        <Text className='eyebrow'>Dreamscape</Text>
        <Text className='title'>无限梦境</Text>
        <Text className='subtitle'>
          古风悬疑互动叙事的小程序前端骨架，已经接入 Taro React。
        </Text>
      </View>

      <View className='panel'>
        <Text className='panel-title'>当前状态</Text>
        <Text className='panel-text'>页面入口、工程配置、微信开发者工具配置都已就位。</Text>
        <Button className='action' onClick={handleStart}>
          开始接页面
        </Button>
      </View>
    </View>
  )
}
