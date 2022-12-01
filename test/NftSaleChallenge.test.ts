import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  Nft,
  NftSaleChallenge,
  NftSaleChallengeExploit,
} from '../typechain-types'
import { parseEther } from 'ethers/lib/utils'

describe('NftSaleChallenge', async function () {
  let wallet: SignerWithAddress
  let challenge: NftSaleChallenge

  beforeEach(async function () {
    ;[wallet] = await ethers.getSigners()
    const Challenge = await ethers.getContractFactory('NftSaleChallenge')
    challenge = (await Challenge.deploy()) as NftSaleChallenge
  })

  it('Attack', async function () {
    const nft = (await ethers.getContractFactory('Nft')).attach(
      await challenge.token()
    ) as Nft

    const Exploit = await ethers.getContractFactory('NftSaleChallengeExploit')
    const exploit = (await Exploit.deploy(nft.address, {
      value: parseEther('1'),
    })) as NftSaleChallengeExploit
    await exploit.start()

    expect(await challenge.isSolved()).to.be.true
  })
})
