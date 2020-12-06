import { prisma } from '../../config/prisma'
import { v4 as uuidV4 } from 'uuid'

import jwtdecode from 'jwt-decode'
import { Request, Response } from 'express'

export default new (class DonationController {
  async listAll(_request: Request, response: Response) {
    const allDonations = await prisma.donation.findMany({
      where: {
        approved: false,
      },
      include: {
        donor: {
          include: {
            pf: true,
            pj: true,
          },
        },
        product: true,
        ong: true,
      },
    })

    return response.json(allDonations)
  }

  async listAllApproved(_request: Request, response: Response) {
    const allDonations = await prisma.donation.findMany({
      where: {
        approved: true,
      },
      include: {
        donor: {
          include: {
            pf: true,
            pj: true,
          },
        },
        product: true,
        ong: true,
      },
    })

    return response.json(allDonations)
  }

  async findIn(request: Request, response: Response) {
    const { number } = request.params

    const targetDonation = await prisma.donation.findUnique({
      where: { number },
      include: {
        donor: true,
        product: true,
      },
    })

    return response.json(targetDonation)
  }

  async findMyDonations(request: Request, response: Response) {
    const token = request.headers['x-access-token'] as string
    const user: any = await jwtdecode(token)

    var targetDonor

    if (user.cpf) {
      targetDonor = await prisma.pf.findUnique({
        where: {
          cpf: user.cpf,
        },
        include: {
          donor: true,
        },
      })
    } else if (user.cnpj) {
      targetDonor = await prisma.pj.findUnique({
        where: {
          cnpj: user.cnpj,
        },
        include: {
          donor: true,
        },
      })
    }

    const meDonations = await prisma.donation.findMany({
      where: {
        donor: targetDonor?.donor
      },
      include: {
        donor: true,
        product: true,
      },
    })

    return response.json(meDonations)
  }

  async store(request: any, response: any) {
    const token = request.headers['x-access-token']
    const user: any = jwtdecode(token)

    const { title, description, quantity, products } = request.body

    let targetDonor

    if (user.cpf) {
      targetDonor = await prisma.pf.findUnique({
        where: {
          cpf: user.cpf,
        },
        include: {
          donor: true,
        },
      })
    } else if (user.cnpj) {
      targetDonor = await prisma.pj.findUnique({
        where: {
          cnpj: user.cnpj,
        },
        include: {
          donor: true,
        },
      })
    }

    const idDonor = targetDonor?.donor?.id

    const number = Math.floor(Math.random() * 1000000).toString()

    const newDonation = await prisma.donation.create({
      data: {
        approved: false,
        number,
        title,
        description,
        quantity,
        donor: {
          connect: { id: idDonor },
        },
      },
    })

    await products.map(async (p: { description: string; quantity: number }) => {
      await prisma.product.create({
        data: {
          id: uuidV4(),
          description: p.description,
          quantity: p.quantity,
          donation: {
            connect: {
              number,
            },
          },
        },
      })
    })

    return response.json(newDonation)
  }

  async update(request: any, response: any) {}

  async remove(request: any, response: any) {
    const { number } = request.params
    const user: any = jwtdecode(request.headers['x-access-token'])

    let targetDonor

    if (user.cpf) {
      targetDonor = await prisma.pf.findUnique({
        where: {
          cpf: user.cpf,
        },
        include: {
          donor: true,
        },
      })
    } else if (user.cnpj) {
      targetDonor = await prisma.pj.findUnique({
        where: {
          cnpj: user.cnpj,
        },
        include: {
          donor: true,
        },
      })
    }

    const targetDonation = await prisma.donation.findUnique({
      where: {
        number,
      },
      include: {
        product: true,
      },
    })

    if (targetDonation?.id_donor !== targetDonor?.donor?.id) {
      return response.status(403).json({
        error: `Your aren't a donation's author`,
      })
    } else if (targetDonation?.approved === true) {
      return response.status(403).json({
        error: "Your Can't Remove Accepted Donations",
      })
    } else {
      targetDonation?.product.map(async (p: { id: any }) => {
        await prisma.product.delete({
          where: {
            id: p.id,
          },
        })
      })
      await prisma.donation.delete({
        where: {
          number,
        },
      })

      return response.send()
    }
  }

  /*  Accepts  */

  async accept(request: any, response: any) {
    const { number } = request.params
    const token = request.headers['x-access-token']

    const Decoded: any = jwtdecode(token)

    const targetONG = await prisma.ong.findUnique({
      where: { cnpj: Decoded.cnpj },
    })

    const acceptedDonation = await prisma.donation.update({
      where: {
        number,
      },
      data: {
        approved: true,
        ong: {
          connect: {
            cnpj: targetONG?.cnpj,
          },
        },
      },
    })

    return response.json(acceptedDonation)
  }

  async sented(request: any, response: any) {
    const { number } = request.params
    const token = request.headers['x-access-token']

    const Decoded: any = jwtdecode(token)

    const targetONG = await prisma.ong.findUnique({
      where: { cnpj: Decoded.cnpj },
    })

    const targetDonation = await prisma.donation.findUnique({
      where: {
        number,
      },
      include: {
        product: true,
      },
    })

    if (targetDonation?.cnpj_ong !== targetONG?.cnpj)
      return response.status(401).json({
        err: 'Operation Not Permitted!',
      })

    targetDonation?.product.map(async (p: { id: any }) => {
      await prisma.product.delete({
        where: {
          id: p.id,
        },
      })
    })

    await prisma.donation.delete({
      where: {
        number,
      },
    })

    return response.send()
  }
})()
