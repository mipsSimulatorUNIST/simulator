	.data
data1:	.word   1
data2:	.word   10
	.text
main:
	addiu	$29, $29, -24
	sw	$30, 20($29)
	addu	$30, $29, $0
	sw	$0, 8($30)
loop1:
	lw	$2, 8($30)
	sltiu	$2, $2, 20
	beq	$2, $0, loop2
	lui	$4, 0x1000
	lw	$2, 0($4)
	sw	$2, 12($30)
	lw	$3, 4($4)
	sw	$3, 0($4)
	lw	$3, 12($30)
	sw	$3, 4($4)
	lw	$2, 8($30)
	addiu	$2, $2, 1
	sw	$2, 8($30)
	j	loop1
loop2:
	addu	$2, $2, $0
	addu	$29, $30, $0
	lw	$30, 20($29)
	addiu	$29, $29, 24
