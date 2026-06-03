import React, { useState } from 'react'
import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import ChapterUnlockModal from '../../components/ChapterUnlockModal'

import './index.scss'

export default function IndexPage () {
  const [modalVisible, setModalVisible] = useState(false)

  useLoad(() => {
    console.log('Dreamscape index page loaded.')
  })

  const handleStart = () => {
    setModalVisible(true)
  }

  const handleConfirm = (dontShowToday) => {
    Taro.showToast({
      title: `解锁成功！今日免提示: ${dontShowToday ? '是' : '否'}`,
      icon: 'success',
      duration: 2000
    })
    setModalVisible(false)
  }

  const handleClose = () => {
    Taro.showToast({
      title: '已取消解锁',
      icon: 'none'
    })
    setModalVisible(false)
  }

  return (
    <View className='page'>
      <View className='hero'>
        <Text className='eyebrow'>Dreamscape</Text>
        <Text className='title'>无限梦境</Text>
        <Text className='subtitle'>
          古风悬疑互动叙事小程序，高精美度UI与动画就绪。
        </Text>
      </View>

      <View className='panel'>
        <Text className='panel-title'>新篇章解锁演示</Text>
        <Text className='panel-text'>点击下方按钮，即可预览你所提取的超高精美度“梦境之门解锁篇章”弹窗。</Text>
        <Button className='action' onClick={handleStart}>
          开启第三章 · 青云之巅
        </Button>
      </View>

      <ChapterUnlockModal
        visible={modalVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
        chapterTitle='第三章 · 青云之巅'
        cost={20}
        balance={1268}
      />
    </View>
  )
}

