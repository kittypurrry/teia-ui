/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import screenfull from 'screenfull'
import { useInView } from 'react-intersection-observer'
import classnames from 'classnames'
import { iOS } from '@utils/os'
import styles from '@style'
import './style.css'
import { FullScreenEnterIcon, FullScreenExitIcon, EnterAnav } from '@icons'
import { NFT } from '@types'
import { Button } from '@atoms/button'
import { MIMETYPE } from '@constants'

/**
 * Currently fullscreen is disabled on iOS
 * this is mainly because Safari iOS doesn't support fullscreen api.
 */

/**
 * This component handles fullscreen mode
 * and inView prop for lazy loading
 *
 **/
/**
 * This component also handles the iframe injection
 * for the anaverse loading
 *
 **/

const AnavView = (tokenId: string) => {
  return (
    <iframe
      className={styles.anaverse_view}
      title={`#${tokenId} inside Anaverse`}
      id="anavIframe"
      src={`https://anaver.se/?gallery=1&loadsingle=1&&singlecontract=KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton&singletokenid=${tokenId}&partnerPlatform=teia.art`}
    />
  )
}

export const Container = ({
  nft,
  children,
  displayView,
}: {
  nft: NFT
  children: React.ReactNode
  displayView?: boolean
}) => {
  const domElement = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState<boolean>()
  const [inAnav, setInAnav] = useState<boolean>()

  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: false,
  })

  const nofullscreen = [
    MIMETYPE.MP4,
    MIMETYPE.OGV,
    MIMETYPE.QUICKTIME,
    MIMETYPE.WEBM,
  ].includes(nft.mime_type)

  const toggleFullScreen = () => {
    if (!domElement.current) return
    if (screenfull.isFullscreen) {
      screenfull.exit()
    } else {
      screenfull.request(domElement.current, { navigationUI: 'hide' })
    }
  }

  const toggleAnav = () => {
    setInAnav(!inAnav)
  }

  useEffect(() => {
    const fullscreenChange = (e) => {
      if (iOS) {
        return
      }

      if (screenfull.isFullscreen) {
        setFullscreen(true)
      } else {
        setFullscreen(false)
      }
      // simulates resize to fix GLB player
      window.dispatchEvent(new Event('resize'))
    }
    if (nofullscreen || !iOS) {
      document.addEventListener('fullscreenchange', fullscreenChange)
      document.addEventListener(
        'webkitfullscreenchange',
        fullscreenChange,
        false
      )
    }

    return () => {
      if (nofullscreen || !iOS) {
        document.removeEventListener('fullscreenchange', fullscreenChange)
        document.removeEventListener(
          'webkitfullscreenchange',
          fullscreenChange,
          false
        )
      }
    }
  }, [])

  const classes = classnames({
    [styles.container]: true,
    [styles.fullscreen]: fullscreen,
    [styles.flex]: displayView,
    [styles.feed]: !displayView,
  })

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { inView, displayView })
    }
    return child
  })

  return (
    <div ref={ref}>
      <div ref={domElement} className={classes}>
        {inAnav ? AnavView(nft.token_id) : childrenWithProps}

        <div style={{ display: 'flex' }}>
          {displayView && !iOS && !nofullscreen && (
            <Button
              alt={'Fullscreen Button'}
              className={
                styles.icon +
                ' svg-icon ' +
                (fullscreen ? styles.icon_fullscreen : '')
              }
              onClick={toggleFullScreen}
            >
              {fullscreen ? (
                <FullScreenEnterIcon width={32} />
              ) : (
                <FullScreenExitIcon width={32} />
              )}
            </Button>
          )}

          {displayView && !iOS && !nofullscreen && (
            <Button
              // TODO: Add a proper "tooltip" for buttons
              title={'Show in Anaverse'}
              alt={'Anaverse Button'}
              className={styles.icon + ' svg-icon '}
              onClick={toggleAnav}
            >
              {<EnterAnav width={32} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
