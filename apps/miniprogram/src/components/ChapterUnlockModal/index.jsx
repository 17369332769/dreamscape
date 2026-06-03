import React, { useState } from 'react'
import { View, Text, Image, Checkbox, Label } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// Import generated premium assets
import portalGateImg from '../../assets/images/portal_gate.png'
import dreamStoneImg from '../../assets/images/dream_stone.png'
import rewardCharImg from '../../assets/images/reward_character.png'
import rewardScrollImg from '../../assets/images/reward_scroll.png'
import rewardCoinsImg from '../../assets/images/reward_coins.png'
import rewardCrystalsImg from '../../assets/images/reward_crystals.png'
import rewardRuinsImg from '../../assets/images/reward_ruins.png'

export default function ChapterUnlockModal({
  visible = true,
  onClose,
  onConfirm,
  chapterTitle = '第三章 · 青云之巅',
  chapterDesc = '你将踏入更广阔的世界，面对更复杂的命运与抉择。梦境深处的秘密，正等待你揭开……',
  cost = 20,
  balance = 1268,
}) {
  const [dontShowToday, setDontShowToday] = useState(false)

  if (!visible) return null

  const handleCheckboxChange = (e) => {
    setDontShowToday(e.detail.value.includes('today'))
  }

  return (
    <View className='chapter-modal-overlay'>
      <View className='chapter-modal-container'>
        
        {/* Ornate Gold Corner Borders */}
        <View className='border-corner top-left' />
        <View className='border-corner top-right' />
        <View className='border-corner bottom-left' />
        <View className='border-corner bottom-right' />
        
        {/* Star Sparkle at Top Center */}
        <View className='top-sparkle'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#goldGradient)" />
            <defs>
              <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE8B0" />
                <stop offset="50%" stopColor="#C8A050" />
                <stop offset="100%" stopColor="#8A6420" />
              </linearGradient>
            </defs>
          </svg>
        </View>

        {/* Modal Main Header */}
        <View className='chapter-modal-header'>
          <Text className='title-main'>开启新篇章</Text>
          <View className='title-sub-wrapper'>
            <Text className='sub-diamond'>◆</Text>
            <Text className='title-sub'>梦境之门即将开启</Text>
            <Text className='sub-diamond'>◆</Text>
          </View>
        </View>

        {/* Decorative Side Couplets */}
        <View className='side-couplet left-couplet'>
          <Text className='couplet-char'>每</Text>
          <Text className='couplet-char'>一</Text>
          <Text className='couplet-char'>次</Text>
          <Text className='couplet-char'>进</Text>
          <Text className='couplet-char'>入</Text>
          <Text className='couplet-divider'>·</Text>
          <Text className='couplet-char'>都</Text>
          <Text className='couplet-char'>是</Text>
          <Text className='couplet-char'>新</Text>
          <Text className='couplet-char'>的</Text>
          <Text className='couplet-char'>可</Text>
          <Text className='couplet-char'>能</Text>
        </View>
        
        <View className='side-couplet right-couplet'>
          <Text className='couplet-char'>每</Text>
          <Text className='couplet-char'>一</Text>
          <Text className='couplet-char'>次</Text>
          <Text className='couplet-char'>选</Text>
          <Text className='couplet-char'>择</Text>
          <Text className='couplet-divider'>·</Text>
          <Text className='couplet-char'>都</Text>
          <Text className='couplet-char'>是</Text>
          <Text className='couplet-char'>新</Text>
          <Text className='couplet-char'>的</Text>
          <Text className='couplet-char'>命</Text>
          <Text className='couplet-char'>运</Text>
        </View>

        {/* Core Gateway Image Box */}
        <View className='portal-preview-box'>
          <Image src={portalGateImg} className='portal-image' mode='aspectFill' />
          <View className='portal-glow-overlay' />
        </View>

        {/* Chapter Title Detail Box */}
        <View className='chapter-detail-card'>
          <Text className='chapter-title'>解锁{chapterTitle}</Text>
          <Text className='chapter-desc'>{chapterDesc}</Text>
        </View>

        {/* Cost Section */}
        <View className='cost-section'>
          <View className='cost-row'>
            <Text className='cost-label'>进入需消耗</Text>
            <Image src={dreamStoneImg} className='crystal-icon' />
            <Text className='cost-val'>{cost}</Text>
          </View>
          <View className='balance-row'>
            <Text className='balance-label'>当前拥有：</Text>
            <Image src={dreamStoneImg} className='crystal-mini-icon' />
            <Text className='balance-val'>{balance}</Text>
          </View>
        </View>

        {/* Chapter Value Section */}
        <View className='section-title-wrapper'>
          <View className='title-line' />
          <Text className='section-title-text'>本章价值</Text>
          <View className='title-line' />
        </View>

        <View className='value-icons-row'>
          {/* Item 1 */}
          <View className='value-item'>
            <View className='icon-frame'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="url(#goldGradient)" strokeWidth="1" />
                <circle cx="20" cy="20" r="14" stroke="url(#goldGradient)" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M20 9V31M9 20H31" stroke="url(#goldGradient)" strokeWidth="1" />
                <polygon points="20,12 23,20 20,28 17,20" fill="url(#goldGradient)" />
                <circle cx="20" cy="20" r="3" fill="#1C182A" stroke="url(#goldGradient)" strokeWidth="1" />
              </svg>
            </View>
            <Text className='value-heading'>剧情更深入</Text>
            <Text className='value-sub'>主线推进，新的势力与人物登场</Text>
          </View>

          {/* Item 2 */}
          <View className='value-item'>
            <View className='icon-frame'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="url(#goldGradient)" strokeWidth="1" />
                <polygon points="20,8 24,16 32,20 24,24 20,32 16,24 8,20 16,16" fill="url(#goldGradient)" />
                <circle cx="20" cy="20" r="4" fill="#1c182a" stroke="url(#goldGradient)" strokeWidth="1" />
              </svg>
            </View>
            <Text className='value-heading'>抉择更关键</Text>
            <Text className='value-sub'>多线分支交织，你的选择将影响结局</Text>
          </View>

          {/* Item 3 */}
          <View className='value-item'>
            <View className='icon-frame'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="url(#goldGradient)" strokeWidth="1" />
                <path d="M12 16H28V26C28 27.1 27.1 28 26 28H14C12.9 28 12 27.1 12 26V16Z" stroke="url(#goldGradient)" strokeWidth="1.2" fill="#1c182a" />
                <path d="M10 16H30V19H10V16Z" fill="url(#goldGradient)" />
                <circle cx="20" cy="17.5" r="2" fill="#1C182A" stroke="url(#goldGradient)" strokeWidth="1" />
              </svg>
            </View>
            <Text className='value-heading'>收获更丰厚</Text>
            <Text className='value-sub'>稀有道具、特殊剧情与隐藏结局</Text>
          </View>
        </View>

        {/* Possible Rewards Section */}
        <View className='section-title-wrapper'>
          <View className='title-line' />
          <Text className='section-title-text'>可能获得</Text>
          <View className='title-line' />
        </View>

        <View className='rewards-scroll-container'>
          <View className='rewards-row'>
            {/* Card 1 */}
            <View className='reward-card'>
              <View className='reward-image-wrapper'>
                <Image src={rewardCharImg} className='reward-card-image' mode='aspectFill' />
              </View>
              <Text className='reward-name'>新角色相遇</Text>
            </View>

            {/* Card 2 */}
            <View className='reward-card'>
              <View className='reward-image-wrapper'>
                <Image src={rewardScrollImg} className='reward-card-image' mode='aspectFill' />
              </View>
              <Text className='reward-name'>稀有道具</Text>
            </View>

            {/* Card 3 */}
            <View className='reward-card'>
              <View className='reward-image-wrapper'>
                <Image src={rewardCoinsImg} className='reward-card-image' mode='aspectFill' />
              </View>
              <Text className='reward-name'>大量灵石</Text>
            </View>

            {/* Card 4 */}
            <View className='reward-card'>
              <View className='reward-image-wrapper'>
                <Image src={rewardCrystalsImg} className='reward-card-image' mode='aspectFill' />
              </View>
              <Text className='reward-name'>隐藏剧情</Text>
            </View>

            {/* Card 5 */}
            <View className='reward-card'>
              <View className='reward-image-wrapper'>
                <Image src={rewardRuinsImg} className='reward-card-image' mode='aspectFill' />
              </View>
              <Text className='reward-name'>分支结局</Text>
            </View>
          </View>
        </View>

        {/* Checkbox Section */}
        <View className='dont-remind-wrapper'>
          <Checkbox
            value='today'
            checked={dontShowToday}
            className='custom-checkbox'
            onClick={() => setDontShowToday(!dontShowToday)}
          />
          <Text className='checkbox-label' onClick={() => setDontShowToday(!dontShowToday)}>今日不再提示</Text>
        </View>

        {/* Action Buttons */}
        <View className='actions-row'>
          <View className='btn-cancel' onClick={onClose}>
            <Text className='btn-text'>取消</Text>
          </View>
          <View className='btn-confirm' onClick={() => onConfirm?.(dontShowToday)}>
            <View className='btn-confirm-bg' />
            <View className='btn-confirm-content'>
              <Text className='btn-confirm-text'>确认进入</Text>
              <View className='btn-confirm-cost'>
                <Image src={dreamStoneImg} className='btn-crystal-icon' />
                <Text className='btn-cost-val'>{cost}</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
    </View>
  )
}
