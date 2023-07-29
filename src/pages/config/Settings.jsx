/* eslint-disable react-hooks/exhaustive-deps */
import { Page } from '@atoms/layout'
import { Checkbox, Input } from '@atoms/input'
import styles from '@style'
import { rpc_nodes, useLocalSettings } from '@context/localSettingsStore'
import { Select, ThemeSelection } from '@atoms/select'
import { Line } from '@atoms/line'
import { useEffect, useState } from 'react'
import { BANNER_URL } from '@constants'
import JSON5 from 'json5'

export const Settings = () => {
  const [bannerEnabled, setBannerEnabled] = useState(false)
  useEffect(() => {
    async function getBanner() {
      const config_response = await fetch(`${BANNER_URL}/banner_config.json`)
      const config_text = await config_response.text()
      const config_parsed = JSON5.parse(config_text)
      console.log(config_parsed)
      setBannerEnabled(config_parsed.enable === 1)
    }
    try {
      getBanner()
    } catch (e) {
      console.error(e)
    }
  }, [])

  const [
    nsfwFriendly,
    setNsfwFriendly,
    photosensitiveFriendly,
    setPhotosensitiveFriendly,
    rpcNode,
    setRpcNode,
    customRpcNode,
    setCustomRpcNode,
    tilted,
    setTilted,
    has_seen_banner,
    setHasSeenBanner,
  ] = useLocalSettings((st) => [
    st.nsfwFriendly,
    st.setNsfwFriendly,
    st.photosensitiveFriendly,
    st.setPhotosensitiveFriendly,
    st.rpcNode,
    st.setRpcNode,
    st.customRpcNode,
    st.setCustomRpcNode,
    st.tilted,
    st.setTilted,
    st.has_seen_banner,
    st.setHasSeenBanner,
  ])

  return (
    <Page>
      <div className={styles.info}>
        <h1>Local Settings</h1>
        <p>
          Those settings are non portable and only stored in your current
          browser cache.
        </p>
        <Line className={styles.title_line} />
      </div>
      <div className={styles.localSettings}>
        <div className={styles.fields}>
          <p>
            <strong>Feed preferences</strong>
          </p>
          <Checkbox
            alt={`click to ${
              nsfwFriendly ? 'disable' : 'enable'
            } the blurring of NSFW tokens on feeds`}
            checked={nsfwFriendly}
            onCheck={setNsfwFriendly}
            label={'Allow NSFW on feeds'}
          />
          <Checkbox
            alt={`click to ${
              photosensitiveFriendly ? 'disable' : 'enable'
            } the blurring of photosensitive tokens on feeds`}
            checked={photosensitiveFriendly}
            onCheck={setPhotosensitiveFriendly}
            label={'Allow Photosensitive on feeds'}
          />

          <Line />
          <ThemeSelection label={'Theme'} />
          <Line />

          <Select
            label={'RPC Node'}
            value={{ label: rpcNode, value: rpcNode }}
            options={rpc_nodes.map((e) => ({ label: e, value: e }))}
            onChange={(e) => {
              setRpcNode(e.value)
            }}
          />
          {rpcNode === 'custom' && (
            <Input
              name="custom-rpc"
              value={customRpcNode}
              onChange={setCustomRpcNode}
              placeholder="url to a RPC node"
              label="Custom RPC node"
              // pattern={'^(?:https?|http):\\/\\/[^\\s\\/$.?#].[^\\s]*$'}
            />
          )}
          <Line />
          <Checkbox
            alt={`click to enable fool around (a throwback of the 2023 april fool)`}
            checked={tilted}
            onCheck={setTilted}
            className="no-fool"
            label={'Fool Around'}
          />
          {bannerEnabled && (
            <Checkbox
              alt={`click to enable fool around (a throwback of the 2023 april fool)`}
              checked={has_seen_banner}
              onCheck={setHasSeenBanner}
              label={'Hide banner for last announcement'}
            />
          )}
        </div>
      </div>
    </Page>
  )
}