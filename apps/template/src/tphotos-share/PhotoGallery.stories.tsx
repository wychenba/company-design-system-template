import type { Meta, StoryObj } from '@storybook/react'
import PhotoGallery from './PhotoGallery'

const meta: Meta<typeof PhotoGallery> = {
  title: 'Apps/template/Photos_share_permission_v1',
  component: PhotoGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'tPhotos share 權限切換 prototype：(1) 勾選照片 → bottom action bar → Share → modal 切 View Permission → OK → icon 更新；(2) hover 照片 → dot-menu → Share → modal 切 View Permission → OK → icon 更新',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PhotoGallery>

export const Default: Story = {
  name: '完整流程',
}
