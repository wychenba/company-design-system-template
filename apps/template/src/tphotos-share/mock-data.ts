export type Visibility = 'public' | 'private'

export interface Photo {
  id: string
  title: string
  dateGroup: string
  timeLabel: string
  durationLabel?: string
  thumbnailUrl: string
  visibility: Visibility
}

export const OWNER = {
  name: 'Wendy Chen',
  meta: 'UXP ｜ WYCHENBA ｜ 150986',
  avatarSrc: 'https://i.pravatar.cc/80?u=wychenba-150986',
}

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'p1',
    title: 'Close-up of a cutting-edge chip design on a tablet screen',
    dateGroup: '2026/07/01',
    timeLabel: '2026/07/01 16:00',
    durationLabel: '0:10',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-chip-tablet/400/300',
    visibility: 'public',
  },
  {
    id: 'p2',
    title: 'Engineers analyzing microchip layouts',
    dateGroup: '2026/07/01',
    timeLabel: '2026/07/01 15:00',
    durationLabel: '0:40',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-microchip-layout/400/300',
    visibility: 'public',
  },
  {
    id: 'p3',
    title: 'Automated robotic arms assembling components',
    dateGroup: '2026/07/01',
    timeLabel: '2026/06/30 15:00',
    durationLabel: '0:32',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-robotic-arms/400/300',
    visibility: 'public',
  },
  {
    id: 'p4',
    title: 'A cleanroom technician inspecting a wafer',
    dateGroup: '2026/07/01',
    timeLabel: '2026/06/29 15:00',
    durationLabel: '1:10',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-cleanroom-wafer/400/300',
    visibility: 'public',
  },
  {
    id: 'p5',
    title: 'Microscopic view of intricate circuitry',
    dateGroup: '2026/07/01',
    timeLabel: '2026/06/28 15:00',
    durationLabel: '2:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-circuitry-macro/400/300',
    visibility: 'public',
  },
  {
    id: 'p6',
    title: 'High-resolution image of a design review session',
    dateGroup: '2026/07/01',
    timeLabel: '2026/06/27 15:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-design-review/400/300',
    visibility: 'public',
  },
  {
    id: 'p7',
    title: 'Photo showcasing advanced prototyping tools',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-prototyping-tools/400/300',
    visibility: 'public',
  },
  {
    id: 'p8',
    title: 'Scientists collaborating on a research board',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-scientists-board/400/300',
    visibility: 'public',
  },
  {
    id: 'p9',
    title: 'Semiconductor chips being tested on a rig',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-chip-test-rig/400/300',
    visibility: 'public',
  },
  {
    id: 'p10',
    title: 'Aerial shot of a large semiconductor fab',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-fab-aerial/400/300',
    visibility: 'public',
  },
  {
    id: 'p11',
    title: 'Close-up of a microprocessor on a workbench',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-microprocessor/400/300',
    visibility: 'public',
  },
  {
    id: 'p12',
    title: 'Technicians monitoring semiconductor analytics on mobile',
    dateGroup: '2026/06/29',
    timeLabel: '2026/06/29 13:00',
    thumbnailUrl: 'https://picsum.photos/seed/tphotos-analytics-mobile/400/300',
    visibility: 'public',
  },
]
