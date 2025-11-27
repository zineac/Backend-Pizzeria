import { Sequelize } from 'sequelize'
import { db } from '../config/db.config.js'
import { Ingrediente } from '../models/ingrediente.model.js'
const parseDateRange = (startDate, endDate) => {
  const where = []
  if (startDate) where.push(`p.fecha_pedido >= '${startDate}'`)
  if (endDate) where.push(`p.fecha_pedido <= '${endDate} 23:59:59'`)
  return where.length ? `AND ${where.join(' AND ')}` : ''
}

export const getPedidosReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      limit: limitRaw,
      limit: limitCamel
    } = req.query
    const limit = Number(limitRaw ?? limitCamel ?? 10)
    const dateFilter = parseDateRange(startDate, endDate)

    const estadosSql = `
      SELECT e.id, e.nombre AS estado, COUNT(*) AS cantidad
      FROM pedidos p
      JOIN estados_pedido e ON p.id_estado = e.id
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY e.id, e.nombre
      ORDER BY cantidad DESC
    `
    const porEstado = await db.query(estadosSql, { type: Sequelize.QueryTypes.SELECT })

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM pedidos p
      WHERE p.activo = 1 ${dateFilter}
    `
    const totalRow = await db.query(totalSql, { type: Sequelize.QueryTypes.SELECT })
    const totalNum = Number(totalRow?.[0]?.total || totalRow?.total || 0)

    const ultimosSql = `
      SELECT p.id, u.nombre AS cliente, p.total, e.nombre AS estado, p.fecha_pedido
      FROM pedidos p
      LEFT JOIN usuarios u ON p.id_cliente = u.id
      LEFT JOIN estados_pedido e ON p.id_estado = e.id
      WHERE p.activo = 1 ${dateFilter}
      ORDER BY p.fecha_pedido DESC
      LIMIT ${limit}
    `
    const ultimos = await db.query(ultimosSql, { type: Sequelize.QueryTypes.SELECT })

    const porEstadoWithPct = porEstado.map(row => ({
      estado: row.estado,
      cantidad: Number(row.cantidad),
      porcentaje: totalNum ? Number(((row.cantidad / totalNum) * 100).toFixed(2)) : 0
    }))

    res.json({
      total: totalNum,
      porEstado: porEstadoWithPct,
      ultimos
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de pedidos' })
  }
}

export const getVentasReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      granularity,
      metodo_pago: metodoPago
    } = req.query
    const gran = granularity ?? 'day'
    const dateFilter = parseDateRange(startDate, endDate)
    const metodoFilter = metodoPago ? `AND m.tipo = '${metodoPago}'` : ''

    const ingresosSql = `
      SELECT
        COALESCE(SUM(p.total),0) AS ingresosTotales,
        COALESCE(AVG(p.total),0) AS promedioPorPedido,
        COUNT(*) AS pedidos
      FROM pedidos p
      LEFT JOIN metodos_pago m ON p.id_metodo_pago = m.id
      WHERE p.activo = 1 ${dateFilter} ${metodoFilter}
    `
    const ingresosRowArr = await db.query(ingresosSql, { type: Sequelize.QueryTypes.SELECT })
    const ingresosRow = ingresosRowArr?.[0] || ingresosRowArr

    const ventasPorMetodoSql = `
      SELECT m.tipo AS metodo, COALESCE(SUM(p.total),0) AS total
      FROM pedidos p
      LEFT JOIN metodos_pago m ON p.id_metodo_pago = m.id
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY m.tipo
    `
    const ventasPorMetodo = await db.query(ventasPorMetodoSql, { type: Sequelize.QueryTypes.SELECT })

    const dateFormat =
      gran === 'month' ? '%Y-%m' : gran === 'year' ? '%Y' : '%Y-%m-%d'

    const seriesSql = `
      SELECT DATE_FORMAT(p.fecha_pedido, '${dateFormat}') AS periodo, COALESCE(SUM(p.total),0) AS total
      FROM pedidos p
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY periodo
      ORDER BY periodo ASC
    `
    const serie = await db.query(seriesSql, { type: Sequelize.QueryTypes.SELECT })

    res.json({
      periodo: { start: startDate || null, end: endDate || null },
      ingresosTotales: Number(ingresosRow?.ingresostotales ?? ingresosRow?.ingresosTotales ?? ingresosRow?.ingresos_totales ?? ingresosRow?.ingresosTotales ?? 0),
      promedioPorPedido: Number(ingresosRow?.promedioporpedido ?? ingresosRow?.promedioPorPedido ?? ingresosRow?.promedio_por_pedido ?? ingresosRow?.promedioPorPedido ?? 0),
      ventasPorMetodo,
      serie
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de ventas' })
  }
}

export const getProductosReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      top: topRaw,
      id_categoria: idCategoria
    } = req.query
    const top = Number(topRaw ?? 10)
    const dateFilter = parseDateRange(startDate, endDate)
    const categoriaFilter = idCategoria ? `AND pr.id_categoria = ${Number(idCategoria)}` : ''

    const topSql = `
      SELECT pr.id AS id_producto, pr.nombre, SUM(dp.cantidad) AS cantidad_vendida, SUM(dp.cantidad * dp.precio_unitario) AS ingresos
      FROM detalle_pedido dp
      JOIN pedidos p ON dp.id_pedido = p.id
      JOIN productos pr ON dp.id_producto = pr.id
      WHERE p.activo = 1 ${dateFilter} ${categoriaFilter}
      GROUP BY pr.id, pr.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT ${Number(top)}
    `
    const topRows = await db.query(topSql, { type: Sequelize.QueryTypes.SELECT })

    const menosVendidosSql = `
      SELECT pr.id AS id_producto, pr.nombre, COALESCE(t.cantidad,0) AS cantidad_vendida
      FROM productos pr
      LEFT JOIN (
        SELECT dp.id_producto, SUM(dp.cantidad) AS cantidad
        FROM detalle_pedido dp
        JOIN pedidos p ON dp.id_pedido = p.id
        WHERE p.activo = 1 ${dateFilter}
        GROUP BY dp.id_producto
      ) t ON pr.id = t.id_producto
      WHERE COALESCE(t.cantidad,0) <= 5
      ORDER BY COALESCE(t.cantidad,0) ASC
      LIMIT 10
    `
    const menosVendidos = await db.query(menosVendidosSql, { type: Sequelize.QueryTypes.SELECT })

    res.json({
      top: topRows,
      menos_vendidos: menosVendidos
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de productos' })
  }
}

export const getCategoriasReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      top: topRaw
    } = req.query
    const top = Number(topRaw ?? 10)
    const dateFilter = parseDateRange(startDate, endDate)

    const sql = `
      SELECT c.id, c.nombre, SUM(dp.cantidad) AS cantidad, SUM(dp.cantidad * dp.precio_unitario) AS ingresos
      FROM detalle_pedido dp
      JOIN pedidos p ON dp.id_pedido = p.id
      JOIN productos pr ON dp.id_producto = pr.id
      JOIN categorias c ON pr.id_categoria = c.id
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY c.id, c.nombre
      ORDER BY ingresos DESC
      LIMIT ${Number(top)}
    `
    const categorias = await db.query(sql, { type: Sequelize.QueryTypes.SELECT })

    const totalSql = `
      SELECT SUM(dp.cantidad * dp.precio_unitario) AS total
      FROM detalle_pedido dp
      JOIN pedidos p ON dp.id_pedido = p.id
      WHERE p.activo = 1 ${dateFilter}
    `
    const totalRowArr = await db.query(totalSql, { type: Sequelize.QueryTypes.SELECT })
    const totalNum = Number(totalRowArr?.[0]?.total || totalRowArr?.total || 0)

    const categoriasWithPct = categorias.map(c => ({
      id: c.id,
      nombre: c.nombre,
      cantidad: Number(c.cantidad),
      ingresos: Number(c.ingresos),
      porcentaje: totalNum ? Number(((c.ingresos / totalNum) * 100).toFixed(2)) : 0
    }))

    res.json({ categorias: categoriasWithPct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de categorías' })
  }
}

export const getIngredientesReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      umbral: umbralRaw,
      solo_criticos: soloCriticosSnake,
      soloCriticos: soloCriticosCamel
    } = req.query
    const umbral = Number(umbralRaw ?? 20)
    const soloCriticos = (soloCriticosSnake ?? soloCriticosCamel ?? 'false').toString()
    const dateFilter = parseDateRange(startDate, endDate)

    const usadosFromProductsSql = `
      SELECT pi.id_ingrediente, SUM(dp.cantidad) AS usado_from_products
      FROM detalle_pedido dp
      JOIN pedidos p ON dp.id_pedido = p.id
      JOIN producto_ingredientes pi ON pi.id_producto = dp.id_producto
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY pi.id_ingrediente
    `
    const usadosFromProducts = await db.query(usadosFromProductsSql, { type: Sequelize.QueryTypes.SELECT })

    const personalizadosSql = `
      SELECT pdp.id_ingrediente, SUM(pdp.cantidad) AS usado_personalizado
      FROM pedido_detalle_personalizacion pdp
      JOIN detalle_pedido dp ON pdp.id_detalle_pedido = dp.id
      JOIN pedidos p ON dp.id_pedido = p.id
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY pdp.id_ingrediente
    `
    const usadosPersonalizados = await db.query(personalizadosSql, { type: Sequelize.QueryTypes.SELECT })

    const usadosMap = new Map()
    usadosFromProducts.forEach(r => {
      usadosMap.set(Number(r.id_ingrediente), Number(r.usado_from_products))
    })
    usadosPersonalizados.forEach(r => {
      const id = Number(r.id_ingrediente)
      usadosMap.set(id, (usadosMap.get(id) || 0) + Number(r.usado_personalizado))
    })

    const ingredientes = await Ingrediente.findAll({ where: {}, raw: true })
    const result = ingredientes.map(i => {
      const usado = usadosMap.get(i.id) || 0
      return {
        id: i.id,
        nombre: i.nombre,
        usado,
        stock: Number(i.stock),
        critico: Number(i.stock) <= umbral
      }
    })

    const reorden = result
      .filter(r => r.critico)
      .map(r => ({ id: r.id, nombre: r.nombre, cantidad_recomendada: Math.max(50, Math.ceil(100 - r.stock)) }))

    const out = soloCriticos === 'true' ? result.filter(r => r.critico) : result

    res.json({ ingredientes: out, reorden_sugerido: reorden })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de ingredientes' })
  }
}

export const getClientesReport = async (req, res) => {
  try {
    const {
      start_date: startDate,
      end_date: endDate,
      top: topRaw
    } = req.query
    const top = Number(topRaw ?? 10)
    const dateFilter = parseDateRange(startDate, endDate)

    const sql = `
      SELECT u.id AS id_cliente, u.nombre, COUNT(p.id) AS pedidos, SUM(p.total) AS gasto_total
      FROM pedidos p
      JOIN usuarios u ON p.id_cliente = u.id
      WHERE p.activo = 1 ${dateFilter}
      GROUP BY u.id, u.nombre
      ORDER BY gasto_total DESC
      LIMIT ${Number(top)}
    `
    const topClientes = await db.query(sql, { type: Sequelize.QueryTypes.SELECT })

    const startForUsers = startDate || '1970-01-01'
    const endForUsers = endDate || new Date().toISOString().slice(0, 10)
    const nuevosSql = `
      SELECT DATE_FORMAT(fecha_registro, '%Y-%m') AS mes, COUNT(*) AS nuevos
      FROM usuarios
      WHERE fecha_registro >= '${startForUsers}' AND fecha_registro <= '${endForUsers} 23:59:59'
      GROUP BY mes
      ORDER BY mes ASC
    `
    const nuevosPorMes = await db.query(nuevosSql, { type: Sequelize.QueryTypes.SELECT })

    res.json({ top_clientes: topClientes, nuevos_por_mes: nuevosPorMes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al generar reporte de clientes' })
  }
}
