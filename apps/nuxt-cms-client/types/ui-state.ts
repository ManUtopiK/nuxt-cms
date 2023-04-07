export interface CmsFrameState {
  width: number
  height: number
  bottom: number
  left: number
  open: boolean
  route: string
  position: 'left' | 'right' | 'bottom' | 'top'
}

export interface CmsUISettings {
  componentsView: 'list' | 'graph'
  componentsGraphShowNodeModules: boolean
  componentsGraphShowPages: boolean
  componentsGraphShowLayouts: boolean
  componentsGraphShowWorkspace: boolean
  interactionCloseOnOutsideClick: boolean
  showExperimentalFeatures: boolean
  scale: number
}