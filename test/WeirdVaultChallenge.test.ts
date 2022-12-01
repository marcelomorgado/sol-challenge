import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { WeirdVaultChallenge } from '../typechain-types'

describe('WeirdVaultChallenge', async function () {
  let player: SignerWithAddress
  let challenge: WeirdVaultChallenge

  beforeEach(async function () {
    ;[player] = await ethers.getSigners()

    const Challenge = await ethers.getContractFactory('WeirdVaultChallenge')
    challenge = (await Challenge.deploy()) as WeirdVaultChallenge
  })

  it('Attack', async function () {
    const Exploit = await ethers.getContractFactory(
      'WeirdVaultChallengeExploit'
    )
    await Exploit.deploy(challenge.address, { value: 1 })
    await challenge.complete()
    expect(await challenge.isSolved()).to.be.true
  })
})
