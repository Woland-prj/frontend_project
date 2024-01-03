import {
  context_menu_button_groups,
  slidebarButtonGroupNames,
  slideButtonGroupNames,
} from '@/data/context_menu_buttons.data'
import { useDoc } from '@/hooks/useDoc'
import { useEditor } from '@/hooks/useEditor'
import { TButtonGroup } from '@/types/context_menu_buttons.type'
import Slide from '@slide/Slide'
import ContextMenu from '@ui/context_menu/ContextMenu'
import { SlidePreviewList } from '@ui/slidebar/SlidePreviewList'
import { FC, useEffect, useRef, useState } from 'react'
import styles from './Layout.module.css'

const Layout: FC = () => {
  const { active_slide_id } = useEditor()
  const { slides } = useDoc()
  const ref_slide = useRef<HTMLDivElement>(null)
  const ref_slidebar = useRef<HTMLDivElement>(null)
  const active_slide = slides.filter(slide => slide.id === active_slide_id)[0]
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState(false)
  const [isSlideBarMenuOpen, setIsSlideBarMenuOpen] = useState(false)
  const slidebarGroups: TButtonGroup[] = context_menu_button_groups.filter(
    group => group.id in slidebarButtonGroupNames,
  )
  const slideGroups: TButtonGroup[] = context_menu_button_groups.filter(
    group => group.id in slideButtonGroupNames,
  )

  useEffect(() => {
    ref_slidebar.current?.addEventListener('contextmenu', e => {
      e.preventDefault()
      if (isSlideBarMenuOpen) {
        setIsSlideBarMenuOpen(false)
        setIsSlideMenuOpen(false)
      } else {
        setIsSlideBarMenuOpen(true)
        setIsSlideMenuOpen(false)
      }
    })

    ref_slide.current?.addEventListener('contextmenu', e => {
      e.preventDefault()
      if (isSlideMenuOpen) {
        setIsSlideBarMenuOpen(false)
        setIsSlideMenuOpen(false)
      } else {
        setIsSlideBarMenuOpen(false)
        setIsSlideMenuOpen(true)
      }
    })
  }, [])

  return (
    <div className={styles.layout}>
      <div className={styles.preview} ref={ref_slidebar}>
        <SlidePreviewList />
        {isSlideBarMenuOpen && (
          <ContextMenu
            buttonGroups={slidebarGroups}
            setIsContextMenuOpen={setIsSlideBarMenuOpen}
          ></ContextMenu>
        )}
      </div>
      <div
        className={styles.editor}
        ref={ref_slide}
        onClick={event => {
          if (event.button == 2) {
            // TODO: доделать сохранение координат при ПКМ-клике
          }
        }}
      >
        <Slide slide={active_slide} editable={true} />
        {isSlideMenuOpen && (
          <ContextMenu
            buttonGroups={slideGroups}
            setIsContextMenuOpen={setIsSlideMenuOpen}
          ></ContextMenu>
        )}
      </div>
    </div>
  )
}

export default Layout
